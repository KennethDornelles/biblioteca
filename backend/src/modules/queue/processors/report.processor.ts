import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { ReportJobData, ReportJobResult, ReportType } from '../interfaces/queue.interfaces';
import { ReportService } from '../../report/report.service';

@Processor('report')
export class ReportProcessor {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(private readonly reportService: ReportService) {}

  @Process('generate-report')
  async handleGenerateReport(job: Job<ReportJobData>): Promise<ReportJobResult> {
    const { data } = job;
    const startTime = Date.now();

    this.logger.log(`Processing report job ${job.id}: ${data.type} in ${data.format} format`);

    try {
      // Atualizar progresso do job
      await job.progress(10);

      // Validar dados do relatório
      this.validateReportData(data);

      await job.progress(25);

      // Gerar relatório baseado no tipo
      let result: ReportJobResult;

      switch (data.type) {
        case ReportType.DAILY_LOANS:
          result = await this.generateDailyLoansReport(data);
          break;
        case ReportType.MONTHLY_STATISTICS:
          result = await this.generateMonthlyStatisticsReport(data);
          break;
        case ReportType.OVERDUE_REPORT:
          result = await this.generateOverdueReport(data);
          break;
        case ReportType.USER_ACTIVITY:
          result = await this.generateUserActivityReport(data);
          break;
        case ReportType.MATERIAL_USAGE:
          result = await this.generateMaterialUsageReport(data);
          break;
        case ReportType.FINANCIAL_REPORT:
          result = await this.generateFinancialReport(data);
          break;
        case ReportType.INVENTORY_REPORT:
          result = await this.generateInventoryReport(data);
          break;
        default:
          throw new Error(`Tipo de relatório não suportado: ${data.type}`);
      }

      await job.progress(100);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Report job ${job.id} completed successfully in ${processingTime}ms`);

      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`Report job ${job.id} failed after ${processingTime}ms: ${error.message}`);

      // Retry logic é gerenciada pelo Bull
      throw error;
    }
  }

  private validateReportData(data: ReportJobData): void {
    if (!data.type) {
      throw new Error('Tipo de relatório é obrigatório');
    }

    if (!data.format || !['pdf', 'excel', 'csv', 'json'].includes(data.format)) {
      throw new Error('Formato deve ser pdf, excel, csv ou json');
    }

    if (!data.parameters || typeof data.parameters !== 'object') {
      throw new Error('Parâmetros são obrigatórios e devem ser um objeto');
    }

    if (data.scheduledFor && data.scheduledFor <= new Date()) {
      throw new Error('Data agendada deve ser futura');
    }
  }

  private async generateDailyLoansReport(data: ReportJobData): Promise<ReportJobResult> {
    try {
      const { reportUrl, recordCount } = await this.reportService.generateDailyLoansReport(
        data.parameters.date,
        data.format,
        data.includeCharts,
        data.customFilters
      );

      return {
        success: true,
        reportUrl,
        reportSize: await this.getReportSize(reportUrl),
        generatedAt: new Date(),
        recordCount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate daily loans report: ${error.message}`);
      throw error;
    }
  }

  private async generateMonthlyStatisticsReport(data: ReportJobData): Promise<ReportJobResult> {
    try {
      const { reportUrl, recordCount } = await this.reportService.generateMonthlyStatisticsReport(
        data.parameters.year,
        data.parameters.month,
        data.format,
        data.includeCharts,
        data.customFilters
      );

      return {
        success: true,
        reportUrl,
        reportSize: await this.getReportSize(reportUrl),
        generatedAt: new Date(),
        recordCount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate monthly statistics report: ${error.message}`);
      throw error;
    }
  }

  private async generateOverdueReport(data: ReportJobData): Promise<ReportJobResult> {
    try {
      const { reportUrl, recordCount } = await this.reportService.generateOverdueReport(
        data.parameters.daysOverdue,
        data.parameters.includeFines,
        data.format,
        data.includeCharts,
        data.customFilters
      );

      return {
        success: true,
        reportUrl,
        reportSize: await this.getReportSize(reportUrl),
        generatedAt: new Date(),
        recordCount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate overdue report: ${error.message}`);
      throw error;
    }
  }

  private async generateUserActivityReport(data: ReportJobData): Promise<ReportJobResult> {
    try {
      const { reportUrl, recordCount } = await this.reportService.generateUserActivityReport(
        data.parameters.startDate,
        data.parameters.endDate,
        data.parameters.userType,
        data.format,
        data.includeCharts,
        data.customFilters
      );

      return {
        success: true,
        reportUrl,
        reportSize: await this.getReportSize(reportUrl),
        generatedAt: new Date(),
        recordCount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate user activity report: ${error.message}`);
      throw error;
    }
  }

  private async generateMaterialUsageReport(data: ReportJobData): Promise<ReportJobResult> {
    try {
      const { reportUrl, recordCount } = await this.reportService.generateMaterialUsageReport(
        data.parameters.startDate,
        data.parameters.endDate,
        data.parameters.categoryId,
        data.format,
        data.includeCharts,
        data.customFilters
      );

      return {
        success: true,
        reportUrl,
        reportSize: await this.getReportSize(reportUrl),
        generatedAt: new Date(),
        recordCount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate material usage report: ${error.message}`);
      throw error;
    }
  }

  private async generateFinancialReport(data: ReportJobData): Promise<ReportJobResult> {
    try {
      const { reportUrl, recordCount } = await this.reportService.generateFinancialReport(
        data.parameters.startDate,
        data.parameters.endDate,
        data.parameters.includeFines,
        data.parameters.includeFees,
        data.format,
        data.includeCharts,
        data.customFilters
      );

      return {
        success: true,
        reportUrl,
        reportSize: await this.getReportSize(reportUrl),
        generatedAt: new Date(),
        recordCount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate financial report: ${error.message}`);
      throw error;
    }
  }

  private async generateInventoryReport(data: ReportJobData): Promise<ReportJobResult> {
    try {
      const { reportUrl, recordCount } = await this.reportService.generateInventoryReport(
        data.parameters.categoryId,
        data.parameters.status,
        data.parameters.includeLocation,
        data.format,
        data.includeCharts,
        data.customFilters
      );

      return {
        success: true,
        reportUrl,
        reportSize: await this.getReportSize(reportUrl),
        generatedAt: new Date(),
        recordCount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate inventory report: ${error.message}`);
      throw error;
    }
  }

  private async getReportSize(reportUrl: string): Promise<number> {
    try {
      // Implementar lógica para obter o tamanho do arquivo
      // Pode ser através de uma API ou sistema de arquivos
      return 0; // Placeholder
    } catch (error) {
      this.logger.warn(`Could not determine report size: ${error.message}`);
      return 0;
    }
  }
}
