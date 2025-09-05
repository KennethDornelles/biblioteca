import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewFiltersDto } from './dto/review-filters.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { PaginatedReviewsDto } from './dto/paginated-reviews.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova review' })
  @ApiResponse({ 
    status: 201, 
    description: 'Review criada com sucesso',
    type: ReviewResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário ou material não encontrado' })
  @ApiResponse({ status: 409, description: 'Usuário já fez review para este material' })
  @ApiResponse({ status: 403, description: 'Usuário não pode fazer review para este material' })
  async create(@Body() createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as reviews com filtros e paginação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de reviews retornada com sucesso',
    type: PaginatedReviewsDto 
  })
  async findAll(@Query() filters: ReviewFiltersDto): Promise<PaginatedReviewsDto> {
    return this.reviewService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas das reviews' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas retornadas com sucesso' 
  })
  async getStats() {
    return this.reviewService.getStats();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar reviews de um usuário específico' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reviews do usuário retornadas com sucesso',
    type: PaginatedReviewsDto 
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<PaginatedReviewsDto> {
    return this.reviewService.findByUser(userId, page, limit);
  }

  @Get('material/:materialId')
  @ApiOperation({ summary: 'Listar reviews de um material específico' })
  @ApiParam({ name: 'materialId', description: 'ID do material' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reviews do material retornadas com sucesso',
    type: PaginatedReviewsDto 
  })
  @ApiResponse({ status: 404, description: 'Material não encontrado' })
  async findByMaterial(
    @Param('materialId') materialId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<PaginatedReviewsDto> {
    return this.reviewService.findByMaterial(materialId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma review por ID' })
  @ApiParam({ name: 'id', description: 'ID da review' })
  @ApiResponse({ 
    status: 200, 
    description: 'Review encontrada com sucesso',
    type: ReviewResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Review não encontrada' })
  async findOne(@Param('id') id: string): Promise<ReviewResponseDto> {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma review' })
  @ApiParam({ name: 'id', description: 'ID da review' })
  @ApiResponse({ 
    status: 200, 
    description: 'Review atualizada com sucesso',
    type: ReviewResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Review não encontrada' })
  async update(
    @Param('id') id: string, 
    @Body() updateReviewDto: UpdateReviewDto
  ): Promise<ReviewResponseDto> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma review' })
  @ApiParam({ name: 'id', description: 'ID da review' })
  @ApiResponse({ status: 204, description: 'Review removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Review não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.reviewService.remove(id);
  }
}
