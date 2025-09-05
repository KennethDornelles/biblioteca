import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe, 
  DefaultValuePipe,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';
import { FineFiltersDto } from './dto/fine-filters.dto';
import { PaginatedFinesDto } from './dto/paginated-fines.dto';
import { FineResponseDto } from './dto/fine-response.dto';
import { FineStatisticsDto } from './dto/fine-statistics.dto';
import { FinePaymentDto, FineInstallmentDto } from './dto/fine-payment.dto';

@ApiTags('Multas')
@Controller('fines')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova multa' })
  @ApiResponse({ 
    status: 201, 
    description: 'Multa criada com sucesso', 
    type: FineResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário ou empréstimo não encontrado' })
  @ApiResponse({ status: 409, description: 'Já existe uma multa ativa para este empréstimo' })
  async create(@Body() createFineDto: CreateFineDto): Promise<FineResponseDto> {
    return this.fineService.create(createFineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as multas com filtros e paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de multas retornada com sucesso', 
    type: PaginatedFinesDto 
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query() filters: FineFiltersDto
  ): Promise<PaginatedFinesDto> {
    return this.fineService.findAll({ ...filters, page, limit });
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obter estatísticas das multas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas retornadas com sucesso', 
    type: FineStatisticsDto 
  })
  async getStatistics(): Promise<FineStatisticsDto> {
    return this.fineService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma multa específica por ID' })
  @ApiParam({ name: 'id', description: 'ID da multa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Multa encontrada com sucesso', 
    type: FineResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Multa não encontrada' })
  async findOne(@Param('id') id: string): Promise<FineResponseDto> {
    return this.fineService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma multa existente' })
  @ApiParam({ name: 'id', description: 'ID da multa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Multa atualizada com sucesso', 
    type: FineResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Multa não encontrada' })
  async update(
    @Param('id') id: string, 
    @Body() updateFineDto: UpdateFineDto
  ): Promise<FineResponseDto> {
    return this.fineService.update(id, updateFineDto);
  }

  @Post('pay')
  @ApiOperation({ summary: 'Pagar uma multa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Multa paga com sucesso', 
    type: FineResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou multa não pode ser paga' })
  @ApiResponse({ status: 404, description: 'Multa não encontrada' })
  async payFine(@Body() paymentDto: FinePaymentDto): Promise<FineResponseDto> {
    return this.fineService.payFine(paymentDto);
  }

  @Post('installment')
  @ApiOperation({ summary: 'Parcelar uma multa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Multa parcelada com sucesso', 
    type: FineResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou multa não pode ser parcelada' })
  @ApiResponse({ status: 404, description: 'Multa não encontrada' })
  async createInstallment(@Body() installmentDto: FineInstallmentDto): Promise<FineResponseDto> {
    return this.fineService.createInstallment(installmentDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar uma multa' })
  @ApiParam({ name: 'id', description: 'ID da multa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Multa cancelada com sucesso', 
    type: FineResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Multa não encontrada' })
  async cancelFine(@Param('id') id: string): Promise<FineResponseDto> {
    return this.fineService.cancelFine(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma multa' })
  @ApiParam({ name: 'id', description: 'ID da multa' })
  @ApiResponse({ status: 204, description: 'Multa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Multa não encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.fineService.remove(id);
  }
}
