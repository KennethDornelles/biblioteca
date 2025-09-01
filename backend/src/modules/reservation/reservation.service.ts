import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient, Reservation, ReservationStatus } from '@prisma/client';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationFiltersDto } from './dto/reservation-filters.dto';
import { PaginatedReservationsDto } from './dto/paginated-reservations.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { ReservationStatisticsDto } from './dto/reservation-statistics.dto';
import { ReservationQueueDto } from './dto/reservation-queue.dto';
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_COLORS, RESERVATION_STATUS_ICONS } from '../../enums';

@Injectable()
export class ReservationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createReservationDto.userId }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o material existe
    const material = await this.prisma.material.findUnique({
      where: { id: createReservationDto.materialId }
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado');
    }

    // Verificar se o usuário já tem uma reserva ativa para este material
    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        userId: createReservationDto.userId,
        materialId: createReservationDto.materialId,
        status: ReservationStatus.ACTIVE
      }
    });

    if (existingReservation) {
      throw new ConflictException('Usuário já possui uma reserva ativa para este material');
    }

    // Preparar dados para criação
    const reservationData = {
      userId: createReservationDto.userId,
      materialId: createReservationDto.materialId,
      reservationDate: createReservationDto.reservationDate ? new Date(createReservationDto.reservationDate) : new Date(),
      expirationDate: new Date(createReservationDto.expirationDate),
      status: createReservationDto.status || ReservationStatus.ACTIVE,
      priority: createReservationDto.priority || 1,
      observations: createReservationDto.observations
    };

    const reservation = await this.prisma.reservation.create({
      data: reservationData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true
          }
        },
        material: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            assetNumber: true,
            status: true
          }
        }
      }
    });

    return this.mapToResponseDto(reservation);
  }

  async findAll(filters: ReservationFiltersDto): Promise<PaginatedReservationsDto> {
    const { page = 1, limit = 10, ...filterFields } = filters;
    const skip = (page - 1) * limit;

    // Construir filtros do Prisma
    const where = this.buildWhereClause(filterFields);

    // Buscar reservas com paginação
    const [reservations, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { reservationDate: 'asc' }
        ],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              registrationNumber: true
            }
          },
          material: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              assetNumber: true,
              status: true
            }
          }
        }
      }),
      this.prisma.reservation.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: reservations.map(reservation => this.mapToResponseDto(reservation)),
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    };
  }

  async findOne(id: string): Promise<ReservationResponseDto> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true
          }
        },
        material: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            assetNumber: true,
            status: true
          }
        }
      }
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    return this.mapToResponseDto(reservation);
  }

  async update(id: string, updateReservationDto: UpdateReservationDto): Promise<ReservationResponseDto> {
    // Verificar se a reserva existe
    const existingReservation = await this.prisma.reservation.findUnique({
      where: { id }
    });

    if (!existingReservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (updateReservationDto.status !== undefined) {
      updateData.status = updateReservationDto.status;
    }
    
    if (updateReservationDto.priority !== undefined) {
      updateData.priority = updateReservationDto.priority;
    }
    
    if (updateReservationDto.observations !== undefined) {
      updateData.observations = updateReservationDto.observations;
    }

    if (updateReservationDto.expirationDate) {
      updateData.expirationDate = new Date(updateReservationDto.expirationDate);
    }

    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true
          }
        },
        material: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            assetNumber: true,
            status: true
          }
        }
      }
    });

    return this.mapToResponseDto(reservation);
  }

  async remove(id: string): Promise<void> {
    // Verificar se a reserva existe
    const existingReservation = await this.prisma.reservation.findUnique({
      where: { id }
    });

    if (!existingReservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    await this.prisma.reservation.delete({
      where: { id }
    });
  }

  async cancelReservation(id: string): Promise<ReservationResponseDto> {
    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true
          }
        },
        material: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            assetNumber: true,
            status: true
          }
        }
      }
    });

    return this.mapToResponseDto(reservation);
  }

  async fulfillReservation(id: string): Promise<ReservationResponseDto> {
    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.FULFILLED },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registrationNumber: true
          }
        },
        material: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            assetNumber: true,
            status: true
          }
        }
      }
    });

    return this.mapToResponseDto(reservation);
  }

  async getStatistics(): Promise<ReservationStatisticsDto> {
    const [
      total,
      active,
      fulfilled,
      expired,
      cancelled,
      priorityStats,
      statusStats,
      monthlyStats,
      expiredToday,
      expiringTomorrow
    ] = await Promise.all([
      this.prisma.reservation.count(),
      this.prisma.reservation.count({ where: { status: ReservationStatus.ACTIVE } }),
      this.prisma.reservation.count({ where: { status: ReservationStatus.FULFILLED } }),
      this.prisma.reservation.count({ where: { status: ReservationStatus.EXPIRED } }),
      this.prisma.reservation.count({ where: { status: ReservationStatus.CANCELLED } }),
      this.prisma.reservation.aggregate({
        _avg: { priority: true }
      }),
      this.prisma.reservation.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      this.prisma.reservation.groupBy({
        by: ['createdAt'],
        _count: { createdAt: true }
      }),
      this.prisma.reservation.count({
        where: {
          status: ReservationStatus.ACTIVE,
          expirationDate: {
            lte: new Date(),
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      this.prisma.reservation.count({
        where: {
          status: ReservationStatus.ACTIVE,
          expirationDate: {
            gte: new Date(new Date().setDate(new Date().getDate() + 1)),
            lt: new Date(new Date().setDate(new Date().getDate() + 2))
          }
        }
      })
    ]);

    // Processar estatísticas por status
    const byStatus = {
      [ReservationStatus.ACTIVE]: 0,
      [ReservationStatus.FULFILLED]: 0,
      [ReservationStatus.EXPIRED]: 0,
      [ReservationStatus.CANCELLED]: 0
    };

    statusStats.forEach(stat => {
      byStatus[stat.status as ReservationStatus] = stat._count.status;
    });

    // Processar estatísticas por mês
    const byMonth: Record<string, number> = {};
    monthlyStats.forEach(stat => {
      const month = stat.createdAt.toISOString().substring(0, 7);
      byMonth[month] = (byMonth[month] || 0) + stat._count.createdAt;
    });

    // Calcular estatísticas de prioridade
    const highPriority = await this.prisma.reservation.count({
      where: { priority: { gte: 8 } }
    });

    const mediumPriority = await this.prisma.reservation.count({
      where: { priority: { gte: 4, lte: 7 } }
    });

    const lowPriority = await this.prisma.reservation.count({
      where: { priority: { lte: 3 } }
    });

    return {
      total,
      active,
      fulfilled,
      expired,
      cancelled,
      averagePriority: priorityStats._avg.priority || 0,
      byStatus,
      byMonth,
      expiredToday,
      expiringTomorrow,
      highPriority,
      mediumPriority,
      lowPriority
    };
  }

  async getQueue(materialId: string): Promise<ReservationQueueDto> {
    // Buscar o material
    const material = await this.prisma.material.findUnique({
      where: { id: materialId }
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado');
    }

    // Buscar reservas ativas para o material
    const activeReservations = await this.prisma.reservation.findMany({
      where: {
        materialId,
        status: ReservationStatus.ACTIVE
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { reservationDate: 'asc' }
      ]
    });

    // Calcular tempo de espera para cada reserva
    const queue = activeReservations.map(reservation => {
      const daysWaiting = Math.ceil(
        (new Date().getTime() - reservation.reservationDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        userId: reservation.user.id,
        userName: reservation.user.name,
        reservationDate: reservation.reservationDate,
        priority: reservation.priority,
        daysWaiting
      };
    });

    // Calcular tempo estimado de espera (baseado na média de dias de empréstimo)
    const estimatedWaitTime = queue.length > 0 ? queue.length * 7 : 0;

    // Verificar se o material está disponível
    const isAvailable = material.status === 'AVAILABLE';

    // Calcular data estimada de disponibilidade
    let estimatedAvailabilityDate: Date | undefined;
    if (!isAvailable && queue.length > 0) {
      const estimatedDays = estimatedWaitTime;
      estimatedAvailabilityDate = new Date();
      estimatedAvailabilityDate.setDate(estimatedAvailabilityDate.getDate() + estimatedDays);
    }

    return {
      materialId,
      materialTitle: material.title,
      queue,
      totalWaiting: queue.length,
      estimatedWaitTime,
      isAvailable,
      estimatedAvailabilityDate
    };
  }

  private buildWhereClause(filters: Partial<ReservationFiltersDto>): any {
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.materialId) {
      where.materialId = filters.materialId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.reservationDateFrom || filters.reservationDateTo) {
      where.reservationDate = {};
      if (filters.reservationDateFrom) {
        where.reservationDate.gte = new Date(filters.reservationDateFrom);
      }
      if (filters.reservationDateTo) {
        where.reservationDate.lte = new Date(filters.reservationDateTo);
      }
    }

    if (filters.expirationDateFrom || filters.expirationDateTo) {
      where.expirationDate = {};
      if (filters.expirationDateFrom) {
        where.expirationDate.gte = new Date(filters.expirationDateFrom);
      }
      if (filters.expirationDateTo) {
        where.expirationDate.lte = new Date(filters.expirationDateTo);
      }
    }

    if (filters.priorityMin || filters.priorityMax) {
      where.priority = {};
      if (filters.priorityMin) {
        where.priority.gte = filters.priorityMin;
      }
      if (filters.priorityMax) {
        where.priority.lte = filters.priorityMax;
      }
    }

    if (filters.active === true) {
      where.status = ReservationStatus.ACTIVE;
      where.expirationDate = { gt: new Date() };
    }

    if (filters.expired === true) {
      where.expirationDate = { lte: new Date() };
    }

    if (filters.observations) {
      where.observations = { contains: filters.observations, mode: 'insensitive' };
    }

    return where;
  }

  private mapToResponseDto(reservation: any): ReservationResponseDto {
    const now = new Date();
    const isExpired = reservation.expirationDate < now;
    const daysUntilExpiration = Math.ceil(
      (reservation.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: reservation.id,
      userId: reservation.userId,
      materialId: reservation.materialId,
      reservationDate: reservation.reservationDate,
      expirationDate: reservation.expirationDate,
      status: reservation.status,
      priority: reservation.priority,
      observations: reservation.observations,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      statusLabel: RESERVATION_STATUS_LABELS[reservation.status],
      statusColor: RESERVATION_STATUS_COLORS[reservation.status],
      statusIcon: RESERVATION_STATUS_ICONS[reservation.status],
      isExpired,
      daysUntilExpiration,
      user: reservation.user,
      material: reservation.material
    };
  }
}
