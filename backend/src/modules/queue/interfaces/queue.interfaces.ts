// ==================== ENUMS ====================

export enum JobPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
  URGENT = 'urgent',
}

export enum JobStatus {
  WAITING = 'waiting',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
  PAUSED = 'paused',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown',
}

export enum EmailType {
  WELCOME = 'welcome',
  LOAN_REMINDER = 'loan_reminder',
  OVERDUE_NOTICE = 'overdue_notice',
  RESERVATION_AVAILABLE = 'reservation_available',
  FINE_NOTICE = 'fine_notice',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_VERIFICATION = 'account_verification',
  SYSTEM_NOTIFICATION = 'system_notification',
  PASSWORD_CHANGED = 'password_changed',
  LOAN_CONFIRMATION = 'loan_confirmation',
  LOAN_OVERDUE = 'loan_overdue',
  RESERVATION_CONFIRMATION = 'reservation_confirmation',
  RESERVATION_FULFILLED = 'reservation_fulfilled',
  RESERVATION_REMINDER = 'reservation_reminder',
  FINE_NOTIFICATION = 'fine_notification',
  FINE_OVERDUE = 'fine_overdue',
}

export enum NotificationType {
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook',
  LOGIN_SUCCESS = 'login_success',
  LOAN_CREATED = 'loan_created',
  LOAN_REMINDER = 'loan_reminder',
  LOAN_OVERDUE = 'loan_overdue',
  LOAN_RETURNED = 'loan_returned',
  RESERVATION_CREATED = 'reservation_created',
  RESERVATION_FULFILLED = 'reservation_fulfilled',
  RESERVATION_REMINDER = 'reservation_reminder',
  QUEUE_POSITION_UPDATED = 'queue_position_updated',
  FINE_CREATED = 'fine_created',
  FINE_PAID = 'fine_paid',
  FINE_OVERDUE = 'fine_overdue',
  MATERIAL_AVAILABLE = 'material_available',
}

export enum ReportType {
  DAILY_LOANS = 'daily_loans',
  MONTHLY_STATISTICS = 'monthly_statistics',
  OVERDUE_REPORT = 'overdue_report',
  USER_ACTIVITY = 'user_activity',
  MATERIAL_USAGE = 'material_usage',
  FINANCIAL_REPORT = 'financial_report',
  INVENTORY_REPORT = 'inventory_report',
  AUDIT_LOG = 'audit_log',
}

export enum MaintenanceType {
  DATABASE_CLEANUP = 'database_cleanup',
  LOG_ROTATION = 'log_rotation',
  CACHE_CLEAR = 'cache_clear',
  BACKUP_CREATION = 'backup_creation',
  SYSTEM_HEALTH_CHECK = 'system_health_check',
  PERFORMANCE_OPTIMIZATION = 'performance_optimization',
}

// ==================== EMAIL JOB INTERFACES ====================

export interface EmailJobData {
  type: EmailType;
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, any>;
  attachments?: EmailAttachment[];
  priority?: JobPriority;
  scheduledFor?: Date;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
}

export interface EmailJobResult {
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt: Date;
  recipientCount: number;
}

// ==================== NOTIFICATION JOB INTERFACES ====================

export interface NotificationJobData {
  type: NotificationType;
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: JobPriority;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export interface NotificationJobResult {
  success: boolean;
  notificationId?: string;
  error?: string;
  sentAt: Date;
  deliveryStatus: 'delivered' | 'failed' | 'pending';
}

// ==================== REPORT JOB INTERFACES ====================

export interface ReportJobData {
  type: ReportType;
  parameters: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  recipient?: string;
  priority?: JobPriority;
  scheduledFor?: Date;
  includeCharts?: boolean;
  customFilters?: Record<string, any>;
}

export interface ReportJobResult {
  success: boolean;
  reportUrl?: string;
  reportSize?: number;
  generatedAt: Date;
  error?: string;
  recordCount?: number;
}

// ==================== MAINTENANCE JOB INTERFACES ====================

export interface MaintenanceJobData {
  type: MaintenanceType;
  parameters: Record<string, any>;
  priority?: JobPriority;
  scheduledFor?: Date;
  estimatedDuration?: number;
  requiresDowntime?: boolean;
  rollbackPlan?: string;
}

export interface MaintenanceJobResult {
  success: boolean;
  completedAt: Date;
  duration: number;
  affectedRecords?: number;
  error?: string;
  warnings?: string[];
  recommendations?: string[];
}

// ==================== JOB METADATA INTERFACES ====================

export interface JobMetadata {
  id: string;
  name: string;
  queue: string;
  priority: JobPriority;
  status: JobStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  attempts: number;
  maxAttempts: number;
  delay: number;
  progress: number;
  data: any;
  result?: any;
  error?: string;
  stackTrace?: string;
}

export interface QueueStatistics {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
  total: number;
}

export interface QueueHealth {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  statistics: QueueStatistics;
  lastJobProcessed?: Date;
  averageProcessingTime?: number;
  errorRate?: number;
  recommendations?: string[];
}

// ==================== JOB OPTIONS INTERFACES ====================

export interface JobOptions {
  priority?: JobPriority;
  delay?: number;
  attempts?: number;
  removeOnComplete?: number | boolean;
  removeOnFail?: number | boolean;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
  timeout?: number;
  jobId?: string;
  stackTraceLimit?: number;
}

export interface QueueOptions {
  name: string;
  defaultJobOptions?: JobOptions;
  settings?: {
    stalledInterval?: number;
    maxStalledCount?: number;
    guardInterval?: number;
    retryProcessDelay?: number;
  };
  limiter?: {
    max?: number;
    duration?: number;
    bounceBack?: boolean;
  };
}