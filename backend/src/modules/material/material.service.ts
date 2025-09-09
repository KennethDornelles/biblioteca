import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { SearchMaterialDto } from './dto/search-material.dto';
import { SearchResultDto } from './dto/search-result.dto';
import { MaterialResponseDto } from './dto/material-response.dto';
import { MaterialStatus, MaterialType } from '../../enums';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  async search(searchDto: SearchMaterialDto, user?: any): Promise<SearchResultDto> {
    const startTime = Date.now();
    
    const {
      query,
      title,
      author,
      isbn,
      category,
      subcategory,
      status,
      type,
      language,
      location,
      publicationYear,
      publisher,
      assetNumber,
      available,
      page = 1,
      limit = 10,
      sortBy = 'title',
      sortOrder = 'asc'
    } = searchDto;

    // Construir condições de busca
    const where: any = {};

    // Busca geral por query
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
        { isbn: { contains: query, mode: 'insensitive' } },
        { issn: { contains: query, mode: 'insensitive' } },
        { publisher: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { subcategory: { contains: query, mode: 'insensitive' } },
        { keywords: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { assetNumber: { contains: query, mode: 'insensitive' } }
      ];
    }

    // Filtros específicos
    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (author) where.author = { contains: author, mode: 'insensitive' };
    if (isbn) where.isbn = { contains: isbn, mode: 'insensitive' };
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (subcategory) where.subcategory = { contains: subcategory, mode: 'insensitive' };
    if (status) where.status = status;
    if (type) where.type = type;
    if (language) where.language = { contains: language, mode: 'insensitive' };
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (publicationYear) where.publicationYear = publicationYear;
    if (publisher) where.publisher = { contains: publisher, mode: 'insensitive' };
    if (assetNumber) where.assetNumber = { contains: assetNumber, mode: 'insensitive' };
    
    // Filtro de disponibilidade
    if (available !== undefined) {
      where.status = available ? MaterialStatus.AVAILABLE : { not: MaterialStatus.AVAILABLE };
    }

    // Configurar ordenação
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    try {
      // Executar busca com paginação
      const [materials, total] = await Promise.all([
        this.prisma.material.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.material.count({ where })
      ]);

      // Converter para DTO de resposta
      const materialDtos: MaterialResponseDto[] = materials.map(material => 
        this.mapToResponseDto(material)
      );

      const totalPages = Math.ceil(total / limit);
      const searchTime = Date.now() - startTime;

      // Log da busca se usuário estiver autenticado
      if (user) {
        this.logSearchActivity(user, searchDto, total, searchTime);
      }

      return {
        materials: materialDtos,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        query,
        filters: searchDto,
        searchTime
      };
    } catch (error) {
      throw new Error(`Erro na busca de materiais: ${error.message}`);
    }
  }

  private mapToResponseDto(material: any): MaterialResponseDto {
    return {
      id: material.id,
      title: material.title,
      author: material.author,
      isbn: material.isbn,
      issn: material.issn,
      publisher: material.publisher,
      publicationYear: material.publicationYear,
      edition: material.edition,
      category: material.category,
      subcategory: material.subcategory,
      location: material.location,
      status: material.status,
      type: material.type,
      numberOfPages: material.numberOfPages,
      language: material.language,
      description: material.description,
      keywords: material.keywords,
      assetNumber: material.assetNumber,
      acquisitionValue: material.acquisitionValue ? Number(material.acquisitionValue) : undefined,
      acquisitionDate: material.acquisitionDate,
      supplier: material.supplier,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      statusLabel: this.getStatusLabel(material.status),
      statusColor: this.getStatusColor(material.status),
      typeLabel: this.getTypeLabel(material.type),
      typeIcon: this.getTypeIcon(material.type)
    };
  }

  private getStatusLabel(status: MaterialStatus): string {
    const labels = {
      [MaterialStatus.AVAILABLE]: 'Disponível',
      [MaterialStatus.LOANED]: 'Emprestado',
      [MaterialStatus.RESERVED]: 'Reservado',
      [MaterialStatus.MAINTENANCE]: 'Em Manutenção',
      [MaterialStatus.LOST]: 'Perdido',
      [MaterialStatus.DECOMMISSIONED]: 'Desativado'
    };
    return labels[status] || status;
  }

  private getStatusColor(status: MaterialStatus): string {
    const colors = {
      [MaterialStatus.AVAILABLE]: 'green',
      [MaterialStatus.LOANED]: 'blue',
      [MaterialStatus.RESERVED]: 'orange',
      [MaterialStatus.MAINTENANCE]: 'yellow',
      [MaterialStatus.LOST]: 'red',
      [MaterialStatus.DECOMMISSIONED]: 'gray'
    };
    return colors[status] || 'gray';
  }

  private getTypeLabel(type: MaterialType): string {
    const labels = {
      [MaterialType.BOOK]: 'Livro',
      [MaterialType.MAGAZINE]: 'Revista',
      [MaterialType.JOURNAL]: 'Periódico',
      [MaterialType.DVD]: 'DVD',
      [MaterialType.CD]: 'CD',
      [MaterialType.THESIS]: 'Tese',
      [MaterialType.DISSERTATION]: 'Dissertação',
      [MaterialType.MONOGRAPH]: 'Monografia',
      [MaterialType.ARTICLE]: 'Artigo',
      [MaterialType.MAP]: 'Mapa',
      [MaterialType.OTHER]: 'Outro'
    };
    return labels[type] || type;
  }

  private getTypeIcon(type: MaterialType): string {
    const icons = {
      [MaterialType.BOOK]: '📚',
      [MaterialType.MAGAZINE]: '📰',
      [MaterialType.JOURNAL]: '📄',
      [MaterialType.DVD]: '💿',
      [MaterialType.CD]: '💿',
      [MaterialType.THESIS]: '🎓',
      [MaterialType.DISSERTATION]: '🎓',
      [MaterialType.MONOGRAPH]: '📖',
      [MaterialType.ARTICLE]: '📄',
      [MaterialType.MAP]: '🗺️',
      [MaterialType.OTHER]: '📁'
    };
    return icons[type] || '📁';
  }

  private async logSearchActivity(user: any, searchDto: SearchMaterialDto, resultCount: number, searchTime: number): Promise<void> {
    try {
      // Aqui você pode implementar logging para analytics de busca
      // Por exemplo, salvar em uma tabela de logs de busca ou enviar para um serviço de analytics
      console.log(`Busca realizada por usuário ${user.email} (${user.type}):`, {
        userId: user.sub,
        query: searchDto.query,
        filters: searchDto,
        resultCount,
        searchTime,
        timestamp: new Date().toISOString()
      });

      // Exemplo de como salvar em uma tabela de logs (se necessário):
      // await this.prisma.searchLog.create({
      //   data: {
      //     userId: user.sub,
      //     query: searchDto.query,
      //     filters: JSON.stringify(searchDto),
      //     resultCount,
      //     searchTime,
      //     timestamp: new Date()
      //   }
      // });
    } catch (error) {
      // Não falhar a busca por erro no log
      console.error('Erro ao registrar log de busca:', error);
    }
  }

  async getSearchSuggestions(query: string): Promise<{ suggestions: string[] }> {
    if (!query || query.length < 2) {
      return { suggestions: [] };
    }

    try {
      const searchTerm = query.toLowerCase();
      
      // Buscar sugestões em títulos, autores e categorias
      const [titles, authors, categories] = await Promise.all([
        this.prisma.material.findMany({
          where: {
            title: { contains: searchTerm, mode: 'insensitive' }
          },
          select: { title: true },
          take: 5,
          distinct: ['title']
        }),
        this.prisma.material.findMany({
          where: {
            author: { contains: searchTerm, mode: 'insensitive' }
          },
          select: { author: true },
          take: 5,
          distinct: ['author']
        }),
        this.prisma.material.findMany({
          where: {
            category: { contains: searchTerm, mode: 'insensitive' }
          },
          select: { category: true },
          take: 5,
          distinct: ['category']
        })
      ]);

      const suggestions = [
        ...titles.map(m => m.title),
        ...authors.map(m => m.author),
        ...categories.map(m => m.category)
      ].filter((value, index, self) => self.indexOf(value) === index).slice(0, 10);

      return { suggestions };
    } catch (error) {
      throw new Error(`Erro ao obter sugestões: ${error.message}`);
    }
  }

  async getSearchStats(): Promise<any> {
    // Implementação básica de estatísticas
    // Em uma implementação real, você salvaria os logs de busca em uma tabela
    return {
      totalSearches: 0, // Seria calculado a partir dos logs
      popularQueries: [], // Seria calculado a partir dos logs
      averageSearchTime: 0, // Seria calculado a partir dos logs
      searchesByUserType: {
        STUDENT: 0,
        PROFESSOR: 0,
        LIBRARIAN: 0,
        ADMIN: 0,
        STAFF: 0
      },
      message: 'Estatísticas de busca não implementadas ainda. Implemente uma tabela de logs de busca para ativar esta funcionalidade.'
    };
  }

  async create(createMaterialDto: CreateMaterialDto, user?: any): Promise<MaterialResponseDto> {
    try {
      const material = await this.prisma.material.create({
        data: {
          ...createMaterialDto,
          acquisitionValue: createMaterialDto.acquisitionValue?.toString()
        }
      });

      // Log da criação se usuário estiver autenticado
      if (user) {
        console.log(`Material criado por usuário ${user.email} (${user.type}):`, {
          userId: user.sub,
          materialId: material.id,
          title: material.title,
          timestamp: new Date().toISOString()
        });
      }

      return this.mapToResponseDto(material);
    } catch (error) {
      throw new Error(`Erro ao criar material: ${error.message}`);
    }
  }

  async findAll(
    page: number = 1, 
    limit: number = 20, 
    sortBy: string = 'title', 
    sortOrder: 'asc' | 'desc' = 'asc',
    user?: any
  ): Promise<SearchResultDto> {
    const searchDto: SearchMaterialDto = {
      page,
      limit,
      sortBy,
      sortOrder
    };
    
    return this.search(searchDto, user);
  }

  async findOne(id: string, user?: any): Promise<MaterialResponseDto> {
    try {
      const material = await this.prisma.material.findUnique({
        where: { id },
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  type: true
                }
              }
            },
            orderBy: {
              reviewDate: 'desc'
            }
          },
          loans: {
            where: {
              status: 'ACTIVE'
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          reservations: {
            where: {
              status: 'ACTIVE'
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!material) {
        throw new Error('Material não encontrado');
      }

      // Log da visualização se usuário estiver autenticado
      if (user) {
        console.log(`Material visualizado por usuário ${user.email} (${user.type}):`, {
          userId: user.sub,
          materialId: material.id,
          title: material.title,
          timestamp: new Date().toISOString()
        });
      }

      const materialDto = this.mapToResponseDto(material);
      
      // Adicionar informações extras
      return {
        ...materialDto,
        reviews: material.reviews.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          reviewDate: review.reviewDate,
          user: {
            id: review.user.id,
            name: review.user.name,
            type: review.user.type
          }
        })),
        activeLoans: material.loans.map(loan => ({
          id: loan.id,
          user: loan.user,
          loanDate: loan.loanDate,
          dueDate: loan.dueDate
        })),
        activeReservations: material.reservations.map(reservation => ({
          id: reservation.id,
          user: reservation.user,
          reservationDate: reservation.reservationDate,
          expirationDate: reservation.expirationDate
        })),
        averageRating: material.reviews.length > 0 ? 
          material.reviews.reduce((sum, review) => sum + review.rating, 0) / material.reviews.length : 0,
        totalReviews: material.reviews.length
      } as any;
    } catch (error) {
      throw new Error(`Erro ao buscar material: ${error.message}`);
    }
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto, user?: any): Promise<MaterialResponseDto> {
    try {
      const existingMaterial = await this.prisma.material.findUnique({
        where: { id }
      });

      if (!existingMaterial) {
        throw new Error('Material não encontrado');
      }

      const material = await this.prisma.material.update({
        where: { id },
        data: {
          ...updateMaterialDto,
          acquisitionValue: updateMaterialDto.acquisitionValue?.toString()
        }
      });

      // Log da atualização se usuário estiver autenticado
      if (user) {
        console.log(`Material atualizado por usuário ${user.email} (${user.type}):`, {
          userId: user.sub,
          materialId: material.id,
          title: material.title,
          changes: updateMaterialDto,
          timestamp: new Date().toISOString()
        });
      }

      return this.mapToResponseDto(material);
    } catch (error) {
      throw new Error(`Erro ao atualizar material: ${error.message}`);
    }
  }

  async remove(id: string, user?: any): Promise<void> {
    try {
      const existingMaterial = await this.prisma.material.findUnique({
        where: { id },
        include: {
          loans: {
            where: {
              status: 'ACTIVE'
            }
          },
          reservations: {
            where: {
              status: 'ACTIVE'
            }
          }
        }
      });

      if (!existingMaterial) {
        throw new Error('Material não encontrado');
      }

      // Verificar se há empréstimos ou reservas ativas
      if (existingMaterial.loans.length > 0) {
        throw new Error('Não é possível excluir material com empréstimos ativos');
      }

      if (existingMaterial.reservations.length > 0) {
        throw new Error('Não é possível excluir material com reservas ativas');
      }

      await this.prisma.material.delete({
        where: { id }
      });

      // Log da exclusão se usuário estiver autenticado
      if (user) {
        console.log(`Material excluído por usuário ${user.email} (${user.type}):`, {
          userId: user.sub,
          materialId: id,
          title: existingMaterial.title,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      throw new Error(`Erro ao excluir material: ${error.message}`);
    }
  }

  async getCatalogStatistics(): Promise<any> {
    try {
      const [
        totalMaterials,
        availableMaterials,
        loanedMaterials,
        reservedMaterials,
        maintenanceMaterials,
        materialsByType,
        materialsByCategory,
        recentMaterials,
        topAuthors,
        topPublishers
      ] = await Promise.all([
        this.prisma.material.count(),
        this.prisma.material.count({ where: { status: 'AVAILABLE' } }),
        this.prisma.material.count({ where: { status: 'LOANED' } }),
        this.prisma.material.count({ where: { status: 'RESERVED' } }),
        this.prisma.material.count({ where: { status: 'MAINTENANCE' } }),
        this.prisma.material.groupBy({
          by: ['type'],
          _count: { type: true },
          orderBy: { _count: { type: 'desc' } }
        }),
        this.prisma.material.groupBy({
          by: ['category'],
          _count: { category: true },
          orderBy: { _count: { category: 'desc' } },
          take: 10
        }),
        this.prisma.material.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
            }
          }
        }),
        this.prisma.material.groupBy({
          by: ['author'],
          _count: { author: true },
          orderBy: { _count: { author: 'desc' } },
          take: 10
        }),
        this.prisma.material.groupBy({
          by: ['publisher'],
          _count: { publisher: true },
          orderBy: { _count: { publisher: 'desc' } },
          take: 10
        })
      ]);

      return {
        overview: {
          totalMaterials,
          availableMaterials,
          loanedMaterials,
          reservedMaterials,
          maintenanceMaterials,
          recentMaterials
        },
        distribution: {
          byType: materialsByType.map(item => ({
            type: item.type,
            count: item._count.type,
            label: this.getTypeLabel(item.type as unknown as MaterialType),
            icon: this.getTypeIcon(item.type as unknown as MaterialType)
          })),
          byCategory: materialsByCategory.map(item => ({
            category: item.category,
            count: item._count.category
          }))
        },
        topLists: {
          authors: topAuthors.map(item => ({
            author: item.author,
            count: item._count.author
          })),
          publishers: topPublishers.map(item => ({
            publisher: item.publisher,
            count: item._count.publisher
          }))
        },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas do catálogo: ${error.message}`);
    }
  }

  async getCategories(): Promise<{ category: string; count: number }[]> {
    try {
      const categories = await this.prisma.material.groupBy({
        by: ['category'],
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } }
      });

      return categories.map(item => ({
        category: item.category,
        count: item._count.category
      }));
    } catch (error) {
      throw new Error(`Erro ao obter categorias: ${error.message}`);
    }
  }

  async getSubcategories(category: string): Promise<{ subcategory: string; count: number }[]> {
    try {
      const subcategories = await this.prisma.material.groupBy({
        by: ['subcategory'],
        where: {
          category: category,
          subcategory: { not: null }
        },
        _count: { subcategory: true },
        orderBy: { _count: { subcategory: 'desc' } }
      });

      return subcategories
        .filter(item => item.subcategory !== null)
        .map(item => ({
          subcategory: item.subcategory as string,
          count: item._count.subcategory
        }));
    } catch (error) {
      throw new Error(`Erro ao obter subcategorias: ${error.message}`);
    }
  }

  async getPopularMaterials(limit: number = 10): Promise<MaterialResponseDto[]> {
    try {
      // Buscar materiais mais emprestados
      const popularMaterials = await this.prisma.material.findMany({
        include: {
          _count: {
            select: {
              loans: true
            }
          }
        },
        orderBy: {
          loans: {
            _count: 'desc'
          }
        },
        take: limit
      });

      return popularMaterials.map(material => this.mapToResponseDto(material));
    } catch (error) {
      throw new Error(`Erro ao obter materiais populares: ${error.message}`);
    }
  }

  async getRelatedMaterials(materialId: string, limit: number = 5, user?: any): Promise<MaterialResponseDto[]> {
    try {
      const material = await this.prisma.material.findUnique({
        where: { id: materialId },
        select: { category: true, subcategory: true, author: true }
      });

      if (!material) {
        throw new Error('Material não encontrado');
      }

      const relatedMaterials = await this.prisma.material.findMany({
        where: {
          id: { not: materialId },
          OR: [
            { category: material.category },
            { subcategory: material.subcategory },
            { author: material.author }
          ]
        },
        take: limit
      });

      return relatedMaterials.map(mat => this.mapToResponseDto(mat));
    } catch (error) {
      throw new Error(`Erro ao obter materiais relacionados: ${error.message}`);
    }
  }

  async getLoanHistory(materialId: string, page: number = 1, limit: number = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const [loans, total] = await Promise.all([
        this.prisma.loan.findMany({
          where: { materialId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                type: true
              }
            },
            librarian: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { loanDate: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.loan.count({ where: { materialId } })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        loans: loans.map(loan => ({
          id: loan.id,
          user: loan.user,
          librarian: loan.librarian,
          loanDate: loan.loanDate,
          dueDate: loan.dueDate,
          returnDate: loan.returnDate,
          status: loan.status,
          renewalCount: loan.renewalCount
        })),
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      throw new Error(`Erro ao obter histórico de empréstimos: ${error.message}`);
    }
  }

  async getReviews(
    materialId: string, 
    page: number = 1, 
    limit: number = 10, 
    sortBy: string = 'reviewDate', 
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      const [reviews, total] = await Promise.all([
        this.prisma.review.findMany({
          where: { materialId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          },
          orderBy,
          skip,
          take: limit
        }),
        this.prisma.review.count({ where: { materialId } })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        reviews: reviews.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          reviewDate: review.reviewDate,
          user: review.user
        })),
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      throw new Error(`Erro ao obter avaliações: ${error.message}`);
    }
  }

  async exportCatalog(format: 'csv' | 'excel' | 'pdf', filters: SearchMaterialDto): Promise<any> {
    try {
      const searchDto: SearchMaterialDto = {
        ...filters,
        page: 1,
        limit: 10000 // Limite alto para exportação
      };

      const result = await this.search(searchDto);
      
      // Aqui você implementaria a lógica de exportação
      // Por enquanto, retornamos os dados para o controller lidar com a formatação
      return {
        format,
        data: result.materials,
        total: result.total,
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Erro ao exportar catálogo: ${error.message}`);
    }
  }
}
