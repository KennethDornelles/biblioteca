import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue, Job } from 'bull';
import { 
  EmailJobData, 
  NotificationJobData, 
  ReportJobData, 
  MaintenanceJobData,
  JobPriority,
  JobStatus 
} from './interfaces/queue.interfaces';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue<EmailJobData>,
    @InjectQueue('notification') private readonly notificationQueue: Queue<NotificationJobData>,
    @InjectQueue('report') private readonly reportQueue: Queue<ReportJobData>,
    @InjectQueue('maintenance') private readonly maintenanceQueue: Queue<MaintenanceJobData>,
  ) {}

  // ==================== EMAIL QUEUE ====================
  
  async addEmailJob(data: EmailJobData, options?: {
    priority?: JobPriority;
    delay?: number;
    attempts?: number;
  }): Promise<Job<EmailJobData>> {
    try {
      const job = await this.emailQueue.add('send-email', data, {
        priority: options?.priority || JobPriority.NORMAL,
        delay: options?.delay || 0,
        attempts: options?.attempts || 3,
        removeOnComplete: 100,
        removeOnFail: 50,
      });

      this.logger.log(`Email job added: ${job.id} - Type: ${data.type}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to add email job: ${error.message}`);
      throw error;
    }
  }

  async getEmailJobStatus(jobId: string): Promise<JobStatus> {
    try {
      const job = await this.emailQueue.getJob(jobId);
      if (!job) {
        return JobStatus.NOT_FOUND;
      }

      const state = await job.getState();
      return this.mapJobStateToStatus(state);
    } catch (error) {
      this.logger.error(`Failed to get email job status: ${error.message}`);
      throw error;
    }
  }

  // ==================== NOTIFICATION QUEUE ====================
  
  async addNotificationJob(data: NotificationJobData, options?: {
    priority?: JobPriority;
    delay?: number;
    attempts?: number;
  }): Promise<Job<NotificationJobData>> {
    try {
      const job = await this.notificationQueue.add('send-notification', data, {
        priority: options?.priority || JobPriority.NORMAL,
        delay: options?.delay || 0,
        attempts: options?.attempts || 3,
        removeOnComplete: 100,
        removeOnFail: 50,
      });

      this.logger.log(`Notification job added: ${job.id} - Type: ${data.type}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to add notification job: ${error.message}`);
      throw error;
    }
  }

  async getNotificationJobStatus(jobId: string): Promise<JobStatus> {
    try {
      const job = await this.notificationQueue.getJob(jobId);
      if (!job) {
        return JobStatus.NOT_FOUND;
      }

      const state = await job.getState();
      return this.mapJobStateToStatus(state);
    } catch (error) {
      this.logger.error(`Failed to get notification job status: ${error.message}`);
      throw error;
    }
  }

  // ==================== REPORT QUEUE ====================
  
  async addReportJob(data: ReportJobData, options?: {
    priority?: JobPriority;
    delay?: number;
    attempts?: number;
  }): Promise<Job<ReportJobData>> {
    try {
      const job = await this.reportQueue.add('generate-report', data, {
        priority: options?.priority || JobPriority.LOW,
        delay: options?.delay || 0,
        attempts: options?.attempts || 3,
        removeOnComplete: 50,
        removeOnFail: 25,
      });

      this.logger.log(`Report job added: ${job.id} - Type: ${data.type}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to add report job: ${error.message}`);
      throw error;
    }
  }

  async getReportJobStatus(jobId: string): Promise<JobStatus> {
    try {
      const job = await this.reportQueue.getJob(jobId);
      if (!job) {
        return JobStatus.NOT_FOUND;
      }

      const state = await job.getState();
      return this.mapJobStateToStatus(state);
    } catch (error) {
      this.logger.error(`Failed to get report job status: ${error.message}`);
      throw error;
    }
  }

  // ==================== MAINTENANCE QUEUE ====================
  
  async addMaintenanceJob(data: MaintenanceJobData, options?: {
    priority?: JobPriority;
    delay?: number;
    attempts?: number;
  }): Promise<Job<MaintenanceJobData>> {
    try {
      const job = await this.maintenanceQueue.add('perform-maintenance', data, {
        priority: options?.priority || JobPriority.LOW,
        delay: options?.delay || 0,
        attempts: options?.attempts || 3,
        removeOnComplete: 50,
        removeOnFail: 25,
      });

      this.logger.log(`Maintenance job added: ${job.id} - Type: ${data.type}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to add maintenance job: ${error.message}`);
      throw error;
    }
  }

  async getMaintenanceJobStatus(jobId: string): Promise<JobStatus> {
    try {
      const job = await this.maintenanceQueue.getJob(jobId);
      if (!job) {
        return JobStatus.NOT_FOUND;
      }

      const state = await job.getState();
      return this.mapJobStateToStatus(state);
    } catch (error) {
      this.logger.error(`Failed to get maintenance job status: ${error.message}`);
      throw error;
    }
  }

  // ==================== QUEUE MANAGEMENT ====================
  
  async getQueueStats(): Promise<{
    email: any;
    notification: any;
    report: any;
    maintenance: any;
  }> {
    try {
      const [emailStats, notificationStats, reportStats, maintenanceStats] = await Promise.all([
        this.emailQueue.getJobCounts(),
        this.notificationQueue.getJobCounts(),
        this.reportQueue.getJobCounts(),
        this.maintenanceQueue.getJobCounts(),
      ]);

      return {
        email: emailStats,
        notification: notificationStats,
        report: reportStats,
        maintenance: maintenanceStats,
      };
    } catch (error) {
      this.logger.error(`Failed to get queue stats: ${error.message}`);
      throw error;
    }
  }

  async clearCompletedJobs(): Promise<void> {
    try {
      await Promise.all([
        this.emailQueue.clean(1000, 'completed'),
        this.notificationQueue.clean(1000, 'completed'),
        this.reportQueue.clean(1000, 'completed'),
        this.maintenanceQueue.clean(1000, 'completed'),
      ]);

      this.logger.log('Completed jobs cleared from all queues');
    } catch (error) {
      this.logger.error(`Failed to clear completed jobs: ${error.message}`);
      throw error;
    }
  }

  async pauseAllQueues(): Promise<void> {
    try {
      await Promise.all([
        this.emailQueue.pause(),
        this.notificationQueue.pause(),
        this.reportQueue.pause(),
        this.maintenanceQueue.pause(),
      ]);

      this.logger.log('All queues paused');
    } catch (error) {
      this.logger.error(`Failed to pause queues: ${error.message}`);
      throw error;
    }
  }

  async resumeAllQueues(): Promise<void> {
    try {
      await Promise.all([
        this.emailQueue.resume(),
        this.notificationQueue.resume(),
        this.reportQueue.resume(),
        this.maintenanceQueue.resume(),
      ]);

      this.logger.log('All queues resumed');
    } catch (error) {
      this.logger.error(`Failed to resume queues: ${error.message}`);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================
  
  private mapJobStateToStatus(state: string): JobStatus {
    switch (state) {
      case 'active':
        return JobStatus.PROCESSING;
      case 'completed':
        return JobStatus.COMPLETED;
      case 'failed':
        return JobStatus.FAILED;
      case 'delayed':
        return JobStatus.DELAYED;
      case 'waiting':
        return JobStatus.WAITING;
      case 'paused':
        return JobStatus.PAUSED;
      default:
        return JobStatus.UNKNOWN;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await Promise.all([
        this.emailQueue.close(),
        this.notificationQueue.close(),
        this.reportQueue.close(),
        this.maintenanceQueue.close(),
      ]);

      this.logger.log('All queues closed');
    } catch (error) {
      this.logger.error(`Failed to close queues: ${error.message}`);
    }
  }
}
