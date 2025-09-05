import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { MaintenanceJobData, MaintenanceJobResult, MaintenanceType } from '../interfaces/queue.interfaces';
import { MaintenanceService } from '../../maintenance/maintenance.service';

@Processor('maintenance')
export class MaintenanceProcessor {
  private readonly logger = new Logger(MaintenanceProcessor.name);

  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Process('perform-maintenance')
  async handlePerformMaintenance(job: Job<MaintenanceJobData>): Promise<MaintenanceJobResult> {
    const { data } = job;
    const startTime = Date.now();

    this.logger.log(`Processing maintenance job ${job.id}: ${data.type}`);

    try {
      // Atualizar progresso do job
      await job.progress(10);

      // Validar dados da manutenção
      this.validateMaintenanceData(data);

      await job.progress(25);

      // Executar manutenção baseada no tipo
      let result: MaintenanceJobResult;

      switch (data.type) {
        case MaintenanceType.DATABASE_CLEANUP:
          result = await this.performDatabaseCleanup(data);
          break;
        case MaintenanceType.LOG_ROTATION:
          result = await this.performLogRotation(data);
          break;
        case MaintenanceType.CACHE_CLEAR:
          result = await this.performCacheClear(data);
          break;
        case MaintenanceType.BACKUP_CREATION:
          result = await this.performBackupCreation(data);
          break;
        case MaintenanceType.SYSTEM_HEALTH_CHECK:
          result = await this.performSystemHealthCheck(data);
          break;
        case MaintenanceType.PERFORMANCE_OPTIMIZATION:
          result = await this.performPerformanceOptimization(data);
          break;
        default:
          throw new Error(`Tipo de manutenção não suportado: ${data.type}`);
      }

      await job.progress(100);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Maintenance job ${job.id} completed successfully in ${processingTime}ms`);

      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`Maintenance job ${job.id} failed after ${processingTime}ms: ${error.message}`);

      // Retry logic é gerenciada pelo Bull
      throw error;
    }
  }

  private validateMaintenanceData(data: MaintenanceJobData): void {
    if (!data.type) {
      throw new Error('Tipo de manutenção é obrigatório');
    }

    if (!data.parameters || typeof data.parameters !== 'object') {
      throw new Error('Parâmetros são obrigatórios e devem ser um objeto');
    }

    if (data.scheduledFor && data.scheduledFor <= new Date()) {
      throw new Error('Data agendada deve ser futura');
    }

    if (data.estimatedDuration && data.estimatedDuration <= 0) {
      throw new Error('Duração estimada deve ser positiva');
    }
  }

  private async performDatabaseCleanup(data: MaintenanceJobData): Promise<MaintenanceJobResult> {
    try {
      const startTime = Date.now();
      
      const { affectedRecords, warnings, recommendations } = await this.maintenanceService.performDatabaseCleanup(
        data.parameters.cleanupType,
        data.parameters.olderThan,
        data.parameters.maxRecords,
        data.parameters.dryRun
      );

      const duration = Date.now() - startTime;

      return {
        success: true,
        completedAt: new Date(),
        duration,
        affectedRecords,
        warnings,
        recommendations,
      };
    } catch (error) {
      this.logger.error(`Failed to perform database cleanup: ${error.message}`);
      throw error;
    }
  }

  private async performLogRotation(data: MaintenanceJobData): Promise<MaintenanceJobResult> {
    try {
      const startTime = Date.now();
      
      const { affectedRecords, warnings, recommendations } = await this.maintenanceService.performLogRotation(
        data.parameters.logTypes,
        data.parameters.maxSize,
        data.parameters.maxFiles,
        data.parameters.compressOld
      );

      const duration = Date.now() - startTime;

      return {
        success: true,
        completedAt: new Date(),
        duration,
        affectedRecords,
        warnings,
        recommendations,
      };
    } catch (error) {
      this.logger.error(`Failed to perform log rotation: ${error.message}`);
      throw error;
    }
  }

  private async performCacheClear(data: MaintenanceJobData): Promise<MaintenanceJobResult> {
    try {
      const startTime = Date.now();
      
      const { affectedRecords, warnings, recommendations } = await this.maintenanceService.performCacheClear(
        data.parameters.cacheTypes,
        data.parameters.pattern,
        data.parameters.force
      );

      const duration = Date.now() - startTime;

      return {
        success: true,
        completedAt: new Date(),
        duration,
        affectedRecords,
        warnings,
        recommendations,
      };
    } catch (error) {
      this.logger.error(`Failed to perform cache clear: ${error.message}`);
      throw error;
    }
  }

  private async performBackupCreation(data: MaintenanceJobData): Promise<MaintenanceJobResult> {
    try {
      const startTime = Date.now();
      
      const { affectedRecords, warnings, recommendations } = await this.maintenanceService.performBackupCreation(
        data.parameters.backupType,
        data.parameters.includeFiles,
        data.parameters.compression,
        data.parameters.encryption
      );

      const duration = Date.now() - startTime;

      return {
        success: true,
        completedAt: new Date(),
        duration,
        affectedRecords,
        warnings,
        recommendations,
      };
    } catch (error) {
      this.logger.error(`Failed to perform backup creation: ${error.message}`);
      throw error;
    }
  }

  private async performSystemHealthCheck(data: MaintenanceJobData): Promise<MaintenanceJobResult> {
    try {
      const startTime = Date.now();
      
      const { affectedRecords, warnings, recommendations } = await this.maintenanceService.performSystemHealthCheck(
        data.parameters.checkTypes,
        data.parameters.thresholds,
        data.parameters.generateReport
      );

      const duration = Date.now() - startTime;

      return {
        success: true,
        completedAt: new Date(),
        duration,
        affectedRecords,
        warnings,
        recommendations,
      };
    } catch (error) {
      this.logger.error(`Failed to perform system health check: ${error.message}`);
      throw error;
    }
  }

  private async performPerformanceOptimization(data: MaintenanceJobData): Promise<MaintenanceJobResult> {
    try {
      const startTime = Date.now();
      
      const { affectedRecords, warnings, recommendations } = await this.maintenanceService.performPerformanceOptimization(
        data.parameters.optimizationType,
        data.parameters.parameters,
        data.parameters.analyzeBefore,
        data.parameters.rollbackOnFailure
      );

      const duration = Date.now() - startTime;

      return {
        success: true,
        completedAt: new Date(),
        duration,
        affectedRecords,
        warnings,
        recommendations,
      };
    } catch (error) {
      this.logger.error(`Failed to perform performance optimization: ${error.message}`);
      throw error;
    }
  }
}
