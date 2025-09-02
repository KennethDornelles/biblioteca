import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, Review, Prisma } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewFiltersDto } from './dto/review-filters.dto';
import { PaginatedReviewsDto } from './dto/paginated-reviews.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { ReviewStats } from '../../types/review.types';

@Injectable()
export class ReviewService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createReviewDto.userId }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o material existe
    const material = await this.prisma.material.findUnique({
      where: { id: createReviewDto.materialId }
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado');
    }

    // Verificar se o usuário já fez review para este material
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_materialId: {
          userId: createReviewDto.userId,
          materialId: createReviewDto.materialId
        }
      }
    });

    if (existingReview) {
      throw new ConflictException('Usuário já fez review para este material');
    }

    // Verificar se o usuário já emprestou o material (opcional - pode ser configurável)
    const hasLoaned = await this.prisma.loan.findFirst({
      where: {
        userId: createReviewDto.userId,
        materialId: createReviewDto.materialId,
        status: 'RETURNED'
      }
    });

    if (!hasLoaned) {
      throw new ForbiddenException('Usuário deve ter emprestado o material para fazer review');
    }

    // Criar a review
    const review = await this.prisma.review.create({
      data: {
        userId: createReviewDto.userId,
        materialId: createReviewDto.materialId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        reviewDate: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        material: {
          select: {
            id: true,
            title: true,
            author: true
          }
        }
      }
    });

    return this.mapToResponseDto(review);
  }

  async findAll(filters: ReviewFiltersDto): Promise<PaginatedReviewsDto> {
    const { page = 1, limit = 10, ...filterFields } = filters;
    const skip = (page - 1) * limit;

    // Construir filtros do Prisma
    const where = this.buildWhereClause(filterFields);

    // Buscar reviews com paginação
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reviewDate: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          material: {
            select: {
              id: true,
              title: true,
              author: true
            }
          }
        }
      }),
      this.prisma.review.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: reviews.map(review => this.mapToResponseDto(review)),
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    };
  }

  async findOne(id: string): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        material: {
          select: {
            id: true,
            title: true,
            author: true
          }
        }
      }
    });

    if (!review) {
      throw new NotFoundException('Review não encontrada');
    }

    return this.mapToResponseDto(review);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<ReviewResponseDto> {
    // Verificar se a review existe
    const existingReview = await this.prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      throw new NotFoundException('Review não encontrada');
    }

    // Atualizar a review
    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        material: {
          select: {
            id: true,
            title: true,
            author: true
          }
        }
      }
    });

    return this.mapToResponseDto(updatedReview);
  }

  async remove(id: string): Promise<void> {
    // Verificar se a review existe
    const existingReview = await this.prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      throw new NotFoundException('Review não encontrada');
    }

    // Remover a review
    await this.prisma.review.delete({
      where: { id }
    });
  }

  async findByUser(userId: string, page = 1, limit = 10): Promise<PaginatedReviewsDto> {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { reviewDate: 'desc' },
        include: {
          material: {
            select: {
              id: true,
              title: true,
              author: true
            }
          }
        }
      }),
      this.prisma.review.count({ where: { userId } })
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: reviews.map(review => this.mapToResponseDto(review)),
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    };
  }

  async findByMaterial(materialId: string, page = 1, limit = 10): Promise<PaginatedReviewsDto> {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { materialId },
        skip,
        take: limit,
        orderBy: { reviewDate: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      this.prisma.review.count({ where: { materialId } })
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: reviews.map(review => this.mapToResponseDto(review)),
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    };
  }

  async getStats(): Promise<ReviewStats> {
    const [
      total,
      totalWithComments,
      totalWithoutComments,
      ratingStats
    ] = await Promise.all([
      this.prisma.review.count(),
      this.prisma.review.count({
        where: {
          comment: {
            not: null
          }
        }
      }),
      this.prisma.review.count({
        where: {
          comment: null
        }
      }),
      this.prisma.review.groupBy({
        by: ['rating'],
        _count: {
          rating: true
        }
      })
    ]);

    const ratingDistribution: Record<number, number> = {};
    ratingStats.forEach(stat => {
      ratingDistribution[stat.rating] = stat._count.rating;
    });

    // Calcular média das notas
    const totalRating = await this.prisma.review.aggregate({
      _sum: {
        rating: true
      }
    });

    const averageRating = total > 0 ? (totalRating._sum.rating || 0) / total : 0;

    return {
      total,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution,
      totalWithComments,
      totalWithoutComments
    };
  }

  private buildWhereClause(filters: Partial<ReviewFiltersDto>): Prisma.ReviewWhereInput {
    const where: Prisma.ReviewWhereInput = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.materialId) {
      where.materialId = filters.materialId;
    }

    if (filters.rating) {
      where.rating = filters.rating;
    }

    if (filters.minRating || filters.maxRating) {
      where.rating = {};
      if (filters.minRating) {
        where.rating.gte = filters.minRating;
      }
      if (filters.maxRating) {
        where.rating.lte = filters.maxRating;
      }
    }

    if (filters.hasComment !== undefined) {
      if (filters.hasComment) {
        where.comment = {
          not: null
        };
      } else {
        where.comment = null;
      }
    }

    return where;
  }

  private mapToResponseDto(review: any): ReviewResponseDto {
    return {
      id: review.id,
      userId: review.userId,
      materialId: review.materialId,
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user,
      material: review.material
    };
  }
}
