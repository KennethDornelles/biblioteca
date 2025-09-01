import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient, Fine, FineStatus } from '@prisma/client';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';
import { FineFiltersDto } from './dto/fine-filters.dto';
import { PaginatedFinesDto } from './dto/paginated-fines.dto';
import { FineResponseDto } from './dto/fine-response.dto';
import { FineStatisticsDto } from './dto/fine-statistics.dto';
import { FinePaymentDto, FineInstallmentDto } from './dto/fine-payment.dto';
import { FINE_STATUS_LABELS, FINE_STATUS_COLORS, FINE_STATUS_ICONS } from '../../enums';

@Injectable()
export class FineService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private canBePaid(fine: Fine): boolean {
    return fine.status === FineStatus.PENDING || fine.status === FineStatus.INSTALLMENT;
  }

  async create(createFineDto: CreateFineDto): Promise<FineResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: createFineDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const loan = await this.prisma.loan.findUnique({
      where: { id: createFineDto.loanId },
    });

    if (!loan) {
      throw new NotFoundException('Empréstimo não encontrado');
    }

    const existingFine = await this.prisma.fine.findFirst({
      where: {
        loanId: createFineDto.loanId,
        status: { in: [FineStatus.PENDING, FineStatus.INSTALLMENT] },
      },
    });

    if (existingFine) {
      throw new ConflictException('Já existe uma multa ativa para este empréstimo');
    }

    const fineData = {
      loanId: createFineDto.loanId,
      userId: createFineDto.userId,
      amount: createFineDto.amount,
      daysOverdue: createFineDto.daysOverdue,
      creationDate: new Date(),
      dueDate: new Date(createFineDto.dueDate),
      status: createFineDto.status || FineStatus.PENDING,
      description: createFineDto.description,
    };

    const fine = await this.prisma.fine.create({
      data: fineData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true,
          },
        },
        loan: {
          select: {
            id: true,
            materialId: true,
            loanDate: true,
            dueDate: true,
            material: {
              select: {
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    return this.mapToResponseDto(fine);
  }

  async findAll(filters: FineFiltersDto): Promise<PaginatedFinesDto> {
    const { page = 1, limit = 10, ...filterFields } = filters;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filterFields);

    const [fines, total] = await Promise.all([
      this.prisma.fine.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ dueDate: 'asc' }, { creationDate: 'desc' }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              registrationNumber: true,
            },
          },
          loan: {
            select: {
              id: true,
              materialId: true,
              loanDate: true,
              dueDate: true,
              material: {
                select: {
                  title: true,
                  author: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.fine.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: fines.map((fine) => this.mapToResponseDto(fine)),
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  }

  async findOne(id: string): Promise<FineResponseDto> {
    const fine = await this.prisma.fine.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true,
          },
        },
        loan: {
          select: {
            id: true,
            materialId: true,
            loanDate: true,
            dueDate: true,
            material: {
              select: {
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    if (!fine) {
      throw new NotFoundException('Multa não encontrada');
    }

    return this.mapToResponseDto(fine);
  }

  async update(id: string, updateFineDto: UpdateFineDto): Promise<FineResponseDto> {
    const existingFine = await this.prisma.fine.findUnique({
      where: { id },
    });

    if (!existingFine) {
      throw new NotFoundException('Multa não encontrada');
    }

    const updateData: any = {};

    if (updateFineDto.status !== undefined) {
      updateData.status = updateFineDto.status;
    }

    if (updateFineDto.description !== undefined) {
      updateData.description = updateFineDto.description;
    }

    if (updateFineDto.dueDate) {
      updateData.dueDate = new Date(updateFineDto.dueDate);
    }

    const fine = await this.prisma.fine.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true,
          },
        },
        loan: {
          select: {
            id: true,
            materialId: true,
            loanDate: true,
            dueDate: true,
            material: {
              select: {
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    return this.mapToResponseDto(fine);
  }

  async remove(id: string): Promise<void> {
    const existingFine = await this.prisma.fine.findUnique({
      where: { id },
    });

    if (!existingFine) {
      throw new NotFoundException('Multa não encontrada');
    }

    await this.prisma.fine.delete({
      where: { id },
    });
  }

  async payFine(paymentDto: FinePaymentDto): Promise<FineResponseDto> {
    const fine = await this.prisma.fine.findUnique({
      where: { id: paymentDto.fineId },
    });

    if (!fine) {
      throw new NotFoundException('Multa não encontrada');
    }

    if (!this.canBePaid(fine)) {
      throw new BadRequestException('Multa não pode ser paga no status atual');
    }

    if (paymentDto.amount < fine.amount.toNumber()) {
      throw new BadRequestException('Valor do pagamento deve ser igual ou maior ao valor da multa');
    }

    const updateData: any = {
      status: FineStatus.PAID,
      paymentDate: paymentDto.paymentDate ? new Date(paymentDto.paymentDate) : new Date(),
    };

    if (paymentDto.observations) {
      updateData.description = fine.description
        ? `${fine.description} | Pagamento: ${paymentDto.observations}`
        : `Pagamento: ${paymentDto.observations}`;
    }

    const updatedFine = await this.prisma.fine.update({
      where: { id: paymentDto.fineId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true,
          },
        },
        loan: {
          select: {
            id: true,
            materialId: true,
            loanDate: true,
            dueDate: true,
            material: {
              select: {
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    return this.mapToResponseDto(updatedFine);
  }

  async cancelFine(id: string): Promise<FineResponseDto> {
    const fine = await this.prisma.fine.update({
      where: { id },
      data: { status: FineStatus.CANCELLED },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true,
          },
        },
        loan: {
          select: {
            id: true,
            materialId: true,
            loanDate: true,
            dueDate: true,
            material: {
              select: {
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    return this.mapToResponseDto(fine);
  }

  async createInstallment(installmentDto: FineInstallmentDto): Promise<FineResponseDto> {
    const fine = await this.prisma.fine.findUnique({
      where: { id: installmentDto.fineId },
    });

    if (!fine) {
      throw new NotFoundException('Multa não encontrada');
    }

    if (fine.status !== FineStatus.PENDING) {
      throw new BadRequestException('Apenas multas pendentes podem ser parceladas');
    }

    if (installmentDto.numberOfInstallments < 2 || installmentDto.numberOfInstallments > 12) {
      throw new BadRequestException('Número de parcelas deve estar entre 2 e 12');
    }

    const totalInstallmentAmount = installmentDto.installmentAmount * installmentDto.numberOfInstallments;
    if (Math.abs(totalInstallmentAmount - fine.amount.toNumber()) > 0.01) {
      throw new BadRequestException('Valor total das parcelas deve ser igual ao valor da multa');
    }

    const updateData: any = {
      status: FineStatus.INSTALLMENT,
      description: fine.description
        ? `${fine.description} | Parcelado em ${installmentDto.numberOfInstallments}x de R$ ${installmentDto.installmentAmount.toFixed(2)}`
        : `Parcelado em ${installmentDto.numberOfInstallments}x de R$ ${installmentDto.installmentAmount.toFixed(2)}`,
    };

    if (installmentDto.observations) {
      updateData.description += ` | ${installmentDto.observations}`;
    }

    const updatedFine = await this.prisma.fine.update({
      where: { id: installmentDto.fineId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true,
          },
        },
        loan: {
          select: {
            id: true,
            materialId: true,
            loanDate: true,
            dueDate: true,
            material: {
              select: {
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    return this.mapToResponseDto(updatedFine);
  }

  async getStatistics(): Promise<FineStatisticsDto> {
    const [
      total,
      pending,
      paid,
      cancelled,
      installment,
      amountStats,
      statusStats,
      monthlyStats,
      dueToday,
      dueTomorrow,
      overdueStats,
    ] = await Promise.all([
      this.prisma.fine.count(),
      this.prisma.fine.count({ where: { status: FineStatus.PENDING } }),
      this.prisma.fine.count({ where: { status: FineStatus.PAID } }),
      this.prisma.fine.count({ where: { status: FineStatus.CANCELLED } }),
      this.prisma.fine.count({ where: { status: FineStatus.INSTALLMENT } }),
      this.prisma.fine.aggregate({
        _sum: { amount: true },
        _avg: { amount: true },
      }),
      this.prisma.fine.groupBy({
        by: ['status'],
        _count: { status: true },
        _sum: { amount: true },
      }),
      this.prisma.fine.groupBy({
        by: ['createdAt'],
        _count: { createdAt: true },
      }),
      this.prisma.fine.count({
        where: {
          status: { in: [FineStatus.PENDING, FineStatus.INSTALLMENT] },
          dueDate: {
            lte: new Date(),
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      this.prisma.fine.count({
        where: {
          status: { in: [FineStatus.PENDING, FineStatus.INSTALLMENT] },
          dueDate: {
            gte: new Date(new Date().setDate(new Date().getDate() + 1)),
            lt: new Date(new Date().setDate(new Date().getDate() + 2)),
          },
        },
      }),
      this.prisma.fine.aggregate({
        where: {
          status: { in: [FineStatus.PENDING, FineStatus.INSTALLMENT] },
          dueDate: { lt: new Date() },
        },
        _count: { id: true },
        _sum: { amount: true },
        _avg: { daysOverdue: true },
      }),
    ]);

    const byStatus = {
      [FineStatus.PENDING]: 0,
      [FineStatus.PAID]: 0,
      [FineStatus.CANCELLED]: 0,
      [FineStatus.INSTALLMENT]: 0,
    };

    const byStatusAmount = {
      [FineStatus.PENDING]: 0,
      [FineStatus.PAID]: 0,
      [FineStatus.CANCELLED]: 0,
      [FineStatus.INSTALLMENT]: 0,
    };

    statusStats.forEach((stat) => {
      byStatus[stat.status as FineStatus] = stat._count.status;
      byStatusAmount[stat.status as FineStatus] = stat._sum.amount?.toNumber() || 0;
    });

    const byMonth: Record<string, number> = {};
    monthlyStats.forEach((stat) => {
      const month = stat.createdAt.toISOString().substring(0, 7);
      byMonth[month] = (byMonth[month] || 0) + stat._count.createdAt;
    });

    return {
      total,
      pending,
      paid,
      cancelled,
      installment,
      totalAmount: amountStats._sum.amount?.toNumber() || 0,
      pendingAmount: byStatusAmount[FineStatus.PENDING],
      paidAmount: byStatusAmount[FineStatus.PAID],
      averageAmount: amountStats._avg.amount?.toNumber() || 0,
      byStatus,
      byMonth,
      dueToday,
      dueTomorrow,
      overdue: overdueStats._count.id || 0,
      overdueAmount: overdueStats._sum.amount?.toNumber() || 0,
      averageDaysOverdue: overdueStats._avg.daysOverdue || 0,
    };
  }

  private buildWhereClause(filters: Partial<FineFiltersDto>): any {
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.loanId) {
      where.loanId = filters.loanId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.amountFrom || filters.amountTo) {
      where.amount = {};
      if (filters.amountFrom) {
        where.amount.gte = filters.amountFrom;
      }
      if (filters.amountTo) {
        where.amount.lte = filters.amountTo;
      }
    }

    if (filters.creationDateFrom || filters.creationDateTo) {
      where.creationDate = {};
      if (filters.creationDateFrom) {
        where.creationDate.gte = new Date(filters.creationDateFrom);
      }
      if (filters.creationDateTo) {
        where.creationDate.lte = new Date(filters.creationDateTo);
      }
    }

    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) {
        where.dueDate.gte = new Date(filters.dueDateFrom);
      }
      if (filters.dueDateTo) {
        where.dueDate.lte = new Date(filters.dueDateTo);
      }
    }

    if (filters.overdue === true) {
      where.dueDate = { lt: new Date() };
      where.status = { in: [FineStatus.PENDING, FineStatus.INSTALLMENT] };
    }

    if (filters.paid === true) {
      where.status = FineStatus.PAID;
    }

    if (filters.description) {
      where.description = { contains: filters.description, mode: 'insensitive' };
    }

    if (filters.daysOverdueMin || filters.daysOverdueMax) {
      where.daysOverdue = {};
      if (filters.daysOverdueMin) {
        where.daysOverdue.gte = filters.daysOverdueMin;
      }
      if (filters.daysOverdueMax) {
        where.daysOverdue.lte = filters.daysOverdueMax;
      }
    }

    return where;
  }

  private mapToResponseDto(fine: any): FineResponseDto {
    const now = new Date();
    const isOverdue = fine.dueDate < now;
    const daysUntilDue = Math.ceil(
      (fine.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: fine.id,
      loanId: fine.loanId,
      userId: fine.userId,
      amount: fine.amount.toNumber(),
      daysOverdue: fine.daysOverdue,
      creationDate: fine.creationDate,
      dueDate: fine.dueDate,
      paymentDate: fine.paymentDate,
      status: fine.status,
      description: fine.description,
      createdAt: fine.createdAt,
      updatedAt: fine.updatedAt,
      statusLabel: FINE_STATUS_LABELS[fine.status],
      statusColor: FINE_STATUS_COLORS[fine.status],
      statusIcon: FINE_STATUS_ICONS[fine.status],
      isOverdue,
      daysUntilDue,
      formattedAmount: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(fine.amount.toNumber()),
      user: fine.user,
      loan: fine.loan,
    };
  }
}