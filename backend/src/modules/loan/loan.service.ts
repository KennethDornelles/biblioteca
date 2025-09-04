import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoanResponseDto } from './dto/loan-response.dto';
import { LoanReturnDto } from './dto/loan-return.dto';
import { LoanRenewalDto } from './dto/loan-renewal.dto';
import { EventBusService, EventFactoryService } from '../../events';
import { LoanStatus, MaterialStatus } from '../../enums';
import { addDays } from 'date-fns';
import { LOAN_STATUS_LABELS, LOAN_STATUS_COLORS, LOAN_STATUS_ICONS } from '../../enums/loan-status.enum';

@Injectable()
export class LoanService {
  private prisma: PrismaClient;

  constructor(
    private readonly eventBus: EventBusService,
    private readonly eventFactory: EventFactoryService,
  ) {
    this.prisma = new PrismaClient();
  }

  async create(createLoanDto: CreateLoanDto): Promise<LoanResponseDto> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createLoanDto.userId }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o material existe e está disponível
    const material = await this.prisma.material.findUnique({
      where: { id: createLoanDto.materialId }
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado');
    }

    if (material.status !== 'AVAILABLE') {
      throw new BadRequestException('Material não está disponível para empréstimo');
    }

    // Calcular data de devolução baseada no tipo de usuário
    const dueDate = addDays(new Date(), user.loanDays);

    // Criar o empréstimo
    const loan = await this.prisma.loan.create({
      data: {
        userId: createLoanDto.userId,
        materialId: createLoanDto.materialId,
        loanDate: new Date(),
        dueDate,
        status: LoanStatus.ACTIVE,
      },
      include: {
        user: true,
        material: true,
      }
    });

    // Atualizar status do material para emprestado
    await this.prisma.material.update({
      where: { id: createLoanDto.materialId },
      data: { status: MaterialStatus.LOANED }
    });

    // Disparar evento de empréstimo criado
    const loanCreatedEvent = this.eventFactory.createLoanCreatedEvent(
      loan.id,
      loan.userId,
      loan.materialId,
      loan.loanDate,
      loan.dueDate,
      loan.status
    );
    
    await this.eventBus.publish(loanCreatedEvent);

    return this.mapToResponseDto(loan);
  }

  async findAll(): Promise<LoanResponseDto[]> {
    const loans = await this.prisma.loan.findMany({
      include: {
        user: true,
        material: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return loans.map(loan => this.mapToResponseDto(loan));
  }

  async findOne(id: string): Promise<LoanResponseDto> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        user: true,
        material: true,
      }
    });

    if (!loan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado`);
    }

    return this.mapToResponseDto(loan);
  }

  async update(id: string, updateLoanDto: UpdateLoanDto): Promise<LoanResponseDto> {
    const existingLoan = await this.prisma.loan.findUnique({
      where: { id }
    });

    if (!existingLoan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado`);
    }

    const updatedLoan = await this.prisma.loan.update({
      where: { id },
      data: updateLoanDto,
      include: {
        user: true,
        material: true,
      }
    });

    return this.mapToResponseDto(updatedLoan);
  }

  async returnLoan(id: string, returnDto: LoanReturnDto): Promise<LoanResponseDto> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        user: true,
        material: true,
      }
    });

    if (!loan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado`);
    }

    if (loan.status !== LoanStatus.ACTIVE) {
      throw new BadRequestException('Empréstimo não está ativo');
    }

    const returnDate = new Date();
    const isOverdue = returnDate > loan.dueDate;
    const daysOverdue = isOverdue ? Math.ceil((returnDate.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Atualizar empréstimo
    const updatedLoan = await this.prisma.loan.update({
      where: { id },
      data: {
        returnDate,
        status: LoanStatus.RETURNED,
        observations: returnDto.observations,
      },
      include: {
        user: true,
        material: true,
      }
    });

    // Atualizar status do material para disponível
    await this.prisma.material.update({
      where: { id: loan.materialId },
      data: { status: 'AVAILABLE' }
    });

    // Disparar evento de empréstimo devolvido
    const loanReturnedEvent = this.eventFactory.createLoanReturnedEvent(
      loan.id,
      loan.userId,
      loan.materialId,
      returnDate,
      loan.dueDate,
      isOverdue,
      daysOverdue
    );
    
    await this.eventBus.publish(loanReturnedEvent);

    return this.mapToResponseDto(updatedLoan);
  }

  async renewLoan(id: string, renewalDto: LoanRenewalDto): Promise<LoanResponseDto> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        user: true,
        material: true,
      }
    });

    if (!loan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado`);
    }

    if (loan.status !== LoanStatus.ACTIVE) {
      throw new BadRequestException('Empréstimo não está ativo');
    }

    // Verificar se pode ser renovado
    const renewalCount = (loan.renewalCount || 0) + 1;
    const maxRenewals = loan.user.loanLimit || 3;

    if (renewalCount > maxRenewals) {
      throw new BadRequestException('Limite de renovações atingido');
    }

    const oldDueDate = loan.dueDate;
    const newDueDate = addDays(loan.dueDate, loan.user.loanDays);

    // Atualizar empréstimo
    const updatedLoan = await this.prisma.loan.update({
      where: { id },
            data: {
        dueDate: newDueDate,
        renewalCount: {
          increment: 1,
        },
        observations: renewalDto.observations,
      },
      include: {
        user: true,
        material: true,
      }
    });

    // Disparar evento de empréstimo renovado
    const loanRenewedEvent = this.eventFactory.createDomainEvent(
      'loan.renewed',
      loan.id,
      2,
      {
        loanId: loan.id,
        userId: loan.userId,
        materialId: loan.materialId,
        oldDueDate,
        newDueDate,
        renewalCount,
        maxRenewals,
      },
      loan.userId
    );
    
    await this.eventBus.publish(loanRenewedEvent);

    return this.mapToResponseDto(updatedLoan);
  }

  async remove(id: string): Promise<{ message: string }> {
    const loan = await this.prisma.loan.findUnique({
      where: { id }
    });

    if (!loan) {
      throw new NotFoundException(`Empréstimo com ID ${id} não encontrado`);
    }

    await this.prisma.loan.delete({
      where: { id }
    });

    return { message: 'Empréstimo removido com sucesso' };
  }

  private mapToResponseDto(loan: any): LoanResponseDto {
    const isOverdue = loan.returnDate ? loan.returnDate > loan.dueDate : new Date() > loan.dueDate && loan.status === LoanStatus.ACTIVE;
    const daysOverdue = isOverdue ? Math.ceil(Math.abs((loan.returnDate || new Date()).getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const canRenew = loan.status === LoanStatus.ACTIVE && loan.renewalCount < loan.maxRenewals && !isOverdue;

    return {
      id: loan.id,
      userId: loan.userId,
      materialId: loan.materialId,
      loanDate: loan.loanDate,
      dueDate: loan.dueDate,
      returnDate: loan.returnDate,
      status: loan.status,
      renewalCount: loan.renewalCount || 0,
      observations: loan.observations,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
      maxRenewals: loan.maxRenewals,
      statusLabel: LOAN_STATUS_LABELS[loan.status],
      statusColor: LOAN_STATUS_COLORS[loan.status],
      statusIcon: LOAN_STATUS_ICONS[loan.status],
      isOverdue: isOverdue,
      daysOverdue: daysOverdue,
      canRenew: canRenew,
      user: loan.user ? {
        id: loan.user.id,
        name: loan.user.name,
        email: loan.user.email,
      } : undefined,
      material: loan.material ? {
        id: loan.material.id,
        title: loan.material.title,
        author: loan.material.author,
      } : undefined,
    };
  }
}