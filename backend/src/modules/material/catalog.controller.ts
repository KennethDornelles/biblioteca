import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { SearchMaterialDto } from './dto/search-material.dto';
import { MaterialFiltersDto } from './dto/material-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../enums';

@Controller('materials')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly materialService: MaterialService) {}

  /**
   * Lista todos os materiais com paginação e filtros
   * GET /materials
   */
  @Get()
  async findAll(
    @Query() filters: MaterialFiltersDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sortBy') sortBy: string = 'title',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Request() req: any
  ) {
    const searchDto: SearchMaterialDto = {
      ...filters,
      page,
      limit,
      sortBy,
      sortOrder
    };
    
    return this.materialService.search(searchDto, req.user);
  }

  /**
   * Busca avançada de materiais
   * GET /materials/search
   */
  @Get('search')
  async search(
    @Query() searchDto: SearchMaterialDto,
    @Request() req: any
  ) {
    return this.materialService.search(searchDto, req.user);
  }

  /**
   * Obtém sugestões de busca
   * GET /materials/suggestions
   */
  @Get('suggestions')
  async getSuggestions(@Query('q') query: string) {
    return this.materialService.getSearchSuggestions(query);
  }

  /**
   * Obtém estatísticas do catálogo
   * GET /materials/statistics
   */
  @Get('statistics')
  async getStatistics() {
    return this.materialService.getCatalogStatistics();
  }

  /**
   * Obtém categorias disponíveis
   * GET /materials/categories
   */
  @Get('categories')
  async getCategories() {
    return this.materialService.getCategories();
  }

  /**
   * Obtém subcategorias de uma categoria
   * GET /materials/categories/:category/subcategories
   */
  @Get('categories/:category/subcategories')
  async getSubcategories(@Param('category') category: string) {
    return this.materialService.getSubcategories(category);
  }

  /**
   * Obtém materiais por categoria
   * GET /materials/categories/:category
   */
  @Get('categories/:category')
  async getMaterialsByCategory(
    @Param('category') category: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sortBy') sortBy: string = 'title',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Request() req: any
  ) {
    const searchDto: SearchMaterialDto = {
      category,
      page,
      limit,
      sortBy,
      sortOrder
    };
    
    return this.materialService.search(searchDto, req.user);
  }

  /**
   * Obtém materiais por tipo
   * GET /materials/types/:type
   */
  @Get('types/:type')
  async getMaterialsByType(
    @Param('type') type: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sortBy') sortBy: string = 'title',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Request() req: any
  ) {
    const searchDto: SearchMaterialDto = {
      type: type as any,
      page,
      limit,
      sortBy,
      sortOrder
    };
    
    return this.materialService.search(searchDto, req.user);
  }

  /**
   * Obtém materiais recentes
   * GET /materials/recent
   */
  @Get('recent')
  async getRecentMaterials(
    @Query('limit') limit: number = 10,
    @Request() req: any
  ) {
    const searchDto: SearchMaterialDto = {
      page: 1,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    return this.materialService.search(searchDto, req.user);
  }

  /**
   * Obtém materiais populares (mais emprestados)
   * GET /materials/popular
   */
  @Get('popular')
  async getPopularMaterials(
    @Query('limit') limit: number = 10,
    @Request() req: any
  ) {
    return this.materialService.getPopularMaterials(limit);
  }

  /**
   * Obtém detalhes de um material específico
   * GET /materials/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.materialService.findOne(id, req.user);
  }

  /**
   * Obtém materiais relacionados
   * GET /materials/:id/related
   */
  @Get(':id/related')
  async getRelatedMaterials(
    @Param('id') id: string,
    @Query('limit') limit: number = 5,
    @Request() req: any
  ) {
    return this.materialService.getRelatedMaterials(id, limit, req.user);
  }

  /**
   * Obtém histórico de empréstimos de um material
   * GET /materials/:id/loan-history
   */
  @Get(':id/loan-history')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  async getLoanHistory(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.materialService.getLoanHistory(id, page, limit);
  }

  /**
   * Obtém avaliações de um material
   * GET /materials/:id/reviews
   */
  @Get(':id/reviews')
  async getReviews(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'reviewDate',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    return this.materialService.getReviews(id, page, limit, sortBy, sortOrder);
  }

  /**
   * Cria um novo material
   * POST /materials
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  async create(@Body() createMaterialDto: CreateMaterialDto, @Request() req: any) {
    return this.materialService.create(createMaterialDto, req.user);
  }

  /**
   * Atualiza um material
   * PATCH /materials/:id
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  async update(
    @Param('id') id: string, 
    @Body() updateMaterialDto: UpdateMaterialDto,
    @Request() req: any
  ) {
    return this.materialService.update(id, updateMaterialDto, req.user);
  }

  /**
   * Remove um material
   * DELETE /materials/:id
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.materialService.remove(id, req.user);
  }

  /**
   * Obtém estatísticas de busca
   * GET /materials/search/stats
   */
  @Get('search/stats')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  async getSearchStats() {
    return this.materialService.getSearchStats();
  }

  /**
   * Exporta catálogo em diferentes formatos
   * GET /materials/export
   */
  @Get('export')
  @UseGuards(RolesGuard)
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  async exportCatalog(
    @Query('format') format: 'csv' | 'excel' | 'pdf' = 'csv',
    @Query() filters: MaterialFiltersDto
  ) {
    return this.materialService.exportCatalog(format, filters);
  }
}
