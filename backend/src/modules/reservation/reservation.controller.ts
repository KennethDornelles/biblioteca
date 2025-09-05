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
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationFiltersDto } from './dto/reservation-filters.dto';
import { PaginatedReservationsDto } from './dto/paginated-reservations.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { ReservationStatisticsDto } from './dto/reservation-statistics.dto';
import { ReservationQueueDto } from './dto/reservation-queue.dto';

@ApiTags('Reservas')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova reserva' })
  @ApiResponse({ 
    status: 201, 
    description: 'Reserva criada com sucesso', 
    type: ReservationResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário ou material não encontrado' })
  @ApiResponse({ status: 409, description: 'Usuário já possui reserva ativa para este material' })
  async create(@Body() createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as reservas com filtros e paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de reservas retornada com sucesso', 
    type: PaginatedReservationsDto 
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query() filters: ReservationFiltersDto
  ): Promise<PaginatedReservationsDto> {
    return this.reservationService.findAll({ ...filters, page, limit });
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obter estatísticas das reservas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas retornadas com sucesso', 
    type: ReservationStatisticsDto 
  })
  async getStatistics(): Promise<ReservationStatisticsDto> {
    return this.reservationService.getStatistics();
  }

  @Get('queue/:materialId')
  @ApiOperation({ summary: 'Obter fila de reservas para um material específico' })
  @ApiParam({ name: 'materialId', description: 'ID do material' })
  @ApiResponse({ 
    status: 200, 
    description: 'Fila de reservas retornada com sucesso', 
    type: ReservationQueueDto 
  })
  @ApiResponse({ status: 404, description: 'Material não encontrado' })
  async getQueue(@Param('materialId') materialId: string): Promise<ReservationQueueDto> {
    return this.reservationService.getQueue(materialId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma reserva específica por ID' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reserva encontrada com sucesso', 
    type: ReservationResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async findOne(@Param('id') id: string): Promise<ReservationResponseDto> {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma reserva existente' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reserva atualizada com sucesso', 
    type: ReservationResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async update(
    @Param('id') id: string, 
    @Body() updateReservationDto: UpdateReservationDto
  ): Promise<ReservationResponseDto> {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar uma reserva' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reserva cancelada com sucesso', 
    type: ReservationResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async cancelReservation(@Param('id') id: string): Promise<ReservationResponseDto> {
    return this.reservationService.cancelReservation(id);
  }

  @Patch(':id/fulfill')
  @ApiOperation({ summary: 'Marcar uma reserva como atendida' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reserva marcada como atendida com sucesso', 
    type: ReservationResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async fulfillReservation(@Param('id') id: string): Promise<ReservationResponseDto> {
    return this.reservationService.fulfillReservation(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma reserva' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 204, description: 'Reserva removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.reservationService.remove(id);
  }
}
