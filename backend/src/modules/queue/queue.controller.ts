import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  HttpStatus,
  HttpCode 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QueueService } from './queue.service';
import type {
  EmailJobData,
  NotificationJobData,
  ReportJobData,
  MaintenanceJobData,
} from './interfaces/queue.interfaces';
import {
  JobPriority,
  JobStatus 
} from './interfaces/queue.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../../enums/user-type.enum';

@ApiTags('Queue Management')
@Controller('queue')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  // ==================== EMAIL QUEUE ENDPOINTS ====================

  @Post('email')
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Adicionar job de email à fila' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Job de email adicionado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos' 
  })
  async addEmailJob(
    @Body() data: EmailJobData,
    @Query('priority') priority?: JobPriority,
    @Query('delay') delay?: number,
    @Query('attempts') attempts?: number
  ) {
    const job = await this.queueService.addEmailJob(data, {
      priority,
      delay: delay ? parseInt(delay.toString()) : undefined,
      attempts: attempts ? parseInt(attempts.toString()) : undefined,
    });

    return {
      success: true,
      message: 'Job de email adicionado à fila',
      jobId: job.id,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
        opts: job.opts,
        timestamp: job.timestamp,
      },
    };
  }

  @Get('email/:jobId/status')
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter status de um job de email' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Status do job obtido com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Job não encontrado' 
  })
  async getEmailJobStatus(@Param('jobId') jobId: string) {
    const status = await this.queueService.getEmailJobStatus(jobId);
    
    return {
      success: true,
      jobId,
      status,
      message: `Status do job: ${status}`,
    };
  }

  // ==================== NOTIFICATION QUEUE ENDPOINTS ====================

  @Post('notification')
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Adicionar job de notificação à fila' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Job de notificação adicionado com sucesso' 
  })
  async addNotificationJob(
    @Body() data: NotificationJobData,
    @Query('priority') priority?: JobPriority,
    @Query('delay') delay?: number,
    @Query('attempts') attempts?: number
  ) {
    const job = await this.queueService.addNotificationJob(data, {
      priority,
      delay: delay ? parseInt(delay.toString()) : undefined,
      attempts: attempts ? parseInt(attempts.toString()) : undefined,
    });

    return {
      success: true,
      message: 'Job de notificação adicionado à fila',
      jobId: job.id,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
        opts: job.opts,
        timestamp: job.timestamp,
      },
    };
  }

  @Get('notification/:jobId/status')
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter status de um job de notificação' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Status do job obtido com sucesso' 
  })
  async getNotificationJobStatus(@Param('jobId') jobId: string) {
    const status = await this.queueService.getNotificationJobStatus(jobId);
    
    return {
      success: true,
      jobId,
      status,
      message: `Status do job: ${status}`,
    };
  }

  // ==================== REPORT QUEUE ENDPOINTS ====================

  @Post('report')
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Adicionar job de relatório à fila' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Job de relatório adicionado com sucesso' 
  })
  async addReportJob(
    @Body() data: ReportJobData,
    @Query('priority') priority?: JobPriority,
    @Query('delay') delay?: number,
    @Query('attempts') attempts?: number
  ) {
    const job = await this.queueService.addReportJob(data, {
      priority,
      delay: delay ? parseInt(delay.toString()) : undefined,
      attempts: attempts ? parseInt(attempts.toString()) : undefined,
    });

    return {
      success: true,
      message: 'Job de relatório adicionado à fila',
      jobId: job.id,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
        opts: job.opts,
        timestamp: job.timestamp,
      },
    };
  }

  @Get('report/:jobId/status')
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter status de um job de relatório' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Status do job obtido com sucesso' 
  })
  async getReportJobStatus(@Param('jobId') jobId: string) {
    const status = await this.queueService.getReportJobStatus(jobId);
    
    return {
      success: true,
      jobId,
      status,
      message: `Status do job: ${status}`,
    };
  }

  // ==================== MAINTENANCE QUEUE ENDPOINTS ====================

  @Post('maintenance')
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Adicionar job de manutenção à fila' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Job de manutenção adicionado com sucesso' 
  })
  async addMaintenanceJob(
    @Body() data: MaintenanceJobData,
    @Query('priority') priority?: JobPriority,
    @Query('delay') delay?: number,
    @Query('attempts') attempts?: number
  ) {
    const job = await this.queueService.addMaintenanceJob(data, {
      priority,
      delay: delay ? parseInt(delay.toString()) : undefined,
      attempts: attempts ? parseInt(attempts.toString()) : undefined,
    });

    return {
      success: true,
      message: 'Job de manutenção adicionado à fila',
      jobId: job.id,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
        opts: job.opts,
        timestamp: job.timestamp,
      },
    };
  }

  @Get('maintenance/:jobId/status')
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Obter status de um job de manutenção' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Status do job obtido com sucesso' 
  })
  async getMaintenanceJobStatus(@Param('jobId') jobId: string) {
    const status = await this.queueService.getMaintenanceJobStatus(jobId);
    
    return {
      success: true,
      jobId,
      status,
      message: `Status do job: ${status}`,
    };
  }

  // ==================== QUEUE MANAGEMENT ENDPOINTS ====================

  @Get('stats')
  @Roles(UserType.LIBRARIAN, UserType.ADMIN)
  @ApiOperation({ summary: 'Obter estatísticas de todas as filas' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Estatísticas obtidas com sucesso' 
  })
  async getQueueStats() {
    const stats = await this.queueService.getQueueStats();
    
    return {
      success: true,
      message: 'Estatísticas das filas obtidas com sucesso',
      stats,
      timestamp: new Date(),
    };
  }

  @Delete('clear-completed')
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Limpar jobs completados de todas as filas' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Jobs completados removidos com sucesso' 
  })
  @HttpCode(HttpStatus.OK)
  async clearCompletedJobs() {
    await this.queueService.clearCompletedJobs();
    
    return {
      success: true,
      message: 'Jobs completados removidos de todas as filas',
      timestamp: new Date(),
    };
  }

  @Post('pause-all')
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Pausar todas as filas' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Todas as filas pausadas com sucesso' 
  })
  @HttpCode(HttpStatus.OK)
  async pauseAllQueues() {
    await this.queueService.pauseAllQueues();
    
    return {
      success: true,
      message: 'Todas as filas foram pausadas',
      timestamp: new Date(),
    };
  }

  @Post('resume-all')
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Retomar todas as filas' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Todas as filas retomadas com sucesso' 
  })
  @HttpCode(HttpStatus.OK)
  async resumeAllQueues() {
    await this.queueService.resumeAllQueues();
    
    return {
      success: true,
      message: 'Todas as filas foram retomadas',
      timestamp: new Date(),
    };
  }

  // ==================== HEALTH CHECK ENDPOINT ====================

  @Get('health')
  @ApiOperation({ summary: 'Verificar saúde das filas' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Status de saúde das filas' 
  })
  async getQueueHealth() {
    const stats = await this.queueService.getQueueStats();
    
    // Calcular métricas de saúde
    const totalJobs = Object.values(stats).reduce((sum: number, queueStats: any) => {
      return sum + (queueStats.waiting || 0) + (queueStats.active || 0) + (queueStats.failed || 0);
    }, 0);

    const failedJobs = Object.values(stats).reduce((sum: number, queueStats: any) => {
      return sum + (queueStats.failed || 0);
    }, 0);

    const errorRate = totalJobs > 0 ? (failedJobs / totalJobs) * 100 : 0;
    
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (errorRate > 10) {
      status = 'critical';
    } else if (errorRate > 5) {
      status = 'warning';
    }

    return {
      success: true,
      status,
      message: `Status das filas: ${status}`,
      metrics: {
        totalJobs,
        failedJobs,
        errorRate: errorRate.toFixed(2),
        queues: Object.keys(stats).length,
      },
      stats,
      timestamp: new Date(),
    };
  }
}
