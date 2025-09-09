import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { MaterialService } from './material.service';
import { SearchMaterialDto } from './dto/search-material.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserType } from '../../enums';

@ApiTags('Busca de Materiais')
@Controller('search')
export class SearchController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Buscar materiais',
    description: 'Realiza busca avançada de materiais com filtros e paginação. Autenticação opcional para logs de busca.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de materiais encontrados com informações de paginação',
    schema: {
      type: 'object',
      properties: {
        materials: {
          type: 'array',
          items: { $ref: '#/components/schemas/MaterialResponseDto' }
        },
        total: { type: 'number', description: 'Total de materiais encontrados' },
        page: { type: 'number', description: 'Página atual' },
        limit: { type: 'number', description: 'Itens por página' },
        totalPages: { type: 'number', description: 'Total de páginas' },
        hasNext: { type: 'boolean', description: 'Se há próxima página' },
        hasPrev: { type: 'boolean', description: 'Se há página anterior' },
        query: { type: 'string', description: 'Query de busca utilizada' },
        searchTime: { type: 'number', description: 'Tempo de busca em milissegundos' }
      }
    }
  })
  @ApiQuery({ name: 'query', required: false, description: 'Busca geral por título, autor, ISBN, etc.' })
  @ApiQuery({ name: 'title', required: false, description: 'Filtrar por título' })
  @ApiQuery({ name: 'author', required: false, description: 'Filtrar por autor' })
  @ApiQuery({ name: 'isbn', required: false, description: 'Filtrar por ISBN' })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoria' })
  @ApiQuery({ name: 'subcategory', required: false, description: 'Filtrar por subcategoria' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status do material' })
  @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo do material' })
  @ApiQuery({ name: 'language', required: false, description: 'Filtrar por idioma' })
  @ApiQuery({ name: 'location', required: false, description: 'Filtrar por localização' })
  @ApiQuery({ name: 'publicationYear', required: false, description: 'Filtrar por ano de publicação' })
  @ApiQuery({ name: 'publisher', required: false, description: 'Filtrar por editora' })
  @ApiQuery({ name: 'assetNumber', required: false, description: 'Filtrar por número do patrimônio' })
  @ApiQuery({ name: 'available', required: false, description: 'Filtrar apenas materiais disponíveis' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 10, máximo: 100)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo para ordenação (padrão: title)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Ordem da classificação: asc ou desc (padrão: asc)' })
  async search(@Query() searchDto: SearchMaterialDto, @Request() req: any) {
    const user = req.user; // Pode ser undefined se não autenticado
    return this.materialService.search(searchDto, user);
  }

  @Get('suggestions')
  @ApiOperation({ 
    summary: 'Obter sugestões de busca',
    description: 'Retorna sugestões baseadas no termo de busca'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de sugestões de busca',
    schema: {
      type: 'object',
      properties: {
        suggestions: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  @ApiQuery({ name: 'q', required: true, description: 'Termo de busca para sugestões' })
  async getSuggestions(@Query('q') query: string) {
    // Implementar sugestões de busca baseadas em títulos, autores e categorias populares
    return this.materialService.getSearchSuggestions(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.LIBRARIAN)
  @ApiOperation({ 
    summary: 'Estatísticas de busca',
    description: 'Retorna estatísticas de busca para administradores e bibliotecários'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas de busca',
    schema: {
      type: 'object',
      properties: {
        totalSearches: { type: 'number' },
        popularQueries: { type: 'array', items: { type: 'string' } },
        averageSearchTime: { type: 'number' },
        searchesByUserType: { type: 'object' }
      }
    }
  })
  async getSearchStats() {
    return this.materialService.getSearchStats();
  }
}
