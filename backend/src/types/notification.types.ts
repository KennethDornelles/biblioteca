// ==================== ENUMS ====================

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  LOAN = 'LOAN',
  RESERVATION = 'RESERVATION',
  FINE = 'FINE',
  SECURITY = 'SECURITY',
  MAINTENANCE = 'MAINTENANCE',
  MARKETING = 'MARKETING',
  REMINDER = 'REMINDER',
  ALERT = 'ALERT',
  WELCOME = 'WELCOME',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCOUNT_VERIFICATION = 'ACCOUNT_VERIFICATION',
  CUSTOM = 'CUSTOM',
}

export enum NotificationCategory {
  URGENT = 'URGENT',
  IMPORTANT = 'IMPORTANT',
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PROMOTIONAL = 'PROMOTIONAL',
  SECURITY = 'SECURITY',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
  WEBHOOK = 'WEBHOOK',
  SLACK = 'SLACK',
  TEAMS = 'TEAMS',
  DISCORD = 'DISCORD',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export enum NotificationFrequency {
  IMMEDIATE = 'IMMEDIATE',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM',
}

export enum DigestFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export enum AnalyticsEvent {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  COMPLAINED = 'COMPLAINED',
}

// ==================== INTERFACES ====================

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  channel: NotificationChannel;
  templateId?: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  sentAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  deliveryStatus: DeliveryStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  channel: NotificationChannel;
  variables: string[];
  isActive: boolean;
  isSystem: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserNotificationPreferences {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone: string;
  language: string;
  categories: Record<string, boolean>;
  channels: Record<string, boolean>;
  frequency: NotificationFrequency;
  digestEnabled: boolean;
  digestFrequency: DigestFrequency;
  digestTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationCampaign {
  id: string;
  name: string;
  description?: string;
  type: NotificationType;
  category: NotificationCategory;
  channel: NotificationChannel;
  templateId?: string;
  targetUsers: Record<string, any>;
  scheduledFor?: Date;
  status: CampaignStatus;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationAnalytics {
  id: string;
  notificationId?: string;
  campaignId?: string;
  userId: string;
  event: AnalyticsEvent;
  timestamp: Date;
  metadata?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}

// ==================== DTOs ====================

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority?: NotificationPriority;
  channel: NotificationChannel;
  templateId?: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
  maxRetries?: number;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  scheduledFor?: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  readAt?: Date;
}

export interface CreateNotificationTemplateDto {
  name: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  channel: NotificationChannel;
  variables: string[];
  isActive?: boolean;
  isSystem?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationTemplateDto {
  name?: string;
  title?: string;
  message?: string;
  type?: NotificationType;
  category?: NotificationCategory;
  channel?: NotificationChannel;
  variables?: string[];
  isActive?: boolean;
  isSystem?: boolean;
  metadata?: Record<string, any>;
}

export interface CreateUserNotificationPreferencesDto {
  userId: string;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  webhookEnabled?: boolean;
  webhookUrl?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone?: string;
  language?: string;
  categories?: Record<string, boolean>;
  channels?: Record<string, boolean>;
  frequency?: NotificationFrequency;
  digestEnabled?: boolean;
  digestFrequency?: DigestFrequency;
  digestTime?: string;
}

export interface UpdateUserNotificationPreferencesDto {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  webhookEnabled?: boolean;
  webhookUrl?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone?: string;
  language?: string;
  categories?: Record<string, boolean>;
  channels?: Record<string, boolean>;
  frequency?: NotificationFrequency;
  digestEnabled?: boolean;
  digestFrequency?: DigestFrequency;
  digestTime?: string;
}

export interface CreateNotificationCampaignDto {
  name: string;
  description?: string;
  type: NotificationType;
  category: NotificationCategory;
  channel: NotificationChannel;
  templateId?: string;
  targetUsers: Record<string, any>;
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationCampaignDto {
  name?: string;
  description?: string;
  type?: NotificationType;
  category?: NotificationCategory;
  channel?: NotificationChannel;
  templateId?: string;
  targetUsers?: Record<string, any>;
  scheduledFor?: Date;
  status?: CampaignStatus;
  metadata?: Record<string, any>;
}

// ==================== RESPONSE TYPES ====================

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  channel: NotificationChannel;
  templateId?: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  sentAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  deliveryStatus: DeliveryStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplateResponse {
  id: string;
  name: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  channel: NotificationChannel;
  variables: string[];
  isActive: boolean;
  isSystem: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserNotificationPreferencesResponse {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone: string;
  language: string;
  categories: Record<string, boolean>;
  channels: Record<string, boolean>;
  frequency: NotificationFrequency;
  digestEnabled: boolean;
  digestFrequency: DigestFrequency;
  digestTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationCampaignResponse {
  id: string;
  name: string;
  description?: string;
  type: NotificationType;
  category: NotificationCategory;
  channel: NotificationChannel;
  templateId?: string;
  targetUsers: Record<string, any>;
  scheduledFor?: Date;
  status: CampaignStatus;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== QUERY TYPES ====================

export interface NotificationQuery {
  userId?: string;
  type?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  channel?: NotificationChannel;
  isRead?: boolean;
  scheduledFor?: {
    from?: Date;
    to?: Date;
  };
  createdAt?: {
    from?: Date;
    to?: Date;
  };
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'scheduledFor' | 'priority';
  orderDirection?: 'asc' | 'desc';
}

export interface NotificationAnalyticsQuery {
  notificationId?: string;
  campaignId?: string;
  userId?: string;
  event?: AnalyticsEvent;
  from?: Date;
  to?: Date;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  limit?: number;
  offset?: number;
}

// ==================== BULK OPERATIONS ====================

export interface BulkNotificationData {
  userIds: string[];
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority?: NotificationPriority;
  channel: NotificationChannel;
  templateId?: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
  maxRetries?: number;
  metadata?: Record<string, any>;
}

export interface BulkNotificationResult {
  success: boolean;
  totalSent: number;
  totalFailed: number;
  errors: Array<{
    userId: string;
    error: string;
  }>;
  notificationIds: string[];
}

// ==================== TEMPLATE PROCESSING ====================

export interface TemplateVariable {
  name: string;
  value: any;
  type: 'string' | 'number' | 'date' | 'boolean' | 'object';
}

export interface ProcessedTemplate {
  title: string;
  message: string;
  variables: Record<string, any>;
}

// ==================== SCHEDULING ====================

export interface NotificationSchedule {
  id: string;
  notificationId: string;
  scheduledFor: Date;
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    endDate?: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== WEBHOOK TYPES ====================

export interface WebhookPayload {
  event: string;
  notificationId: string;
  userId: string;
  timestamp: string;
  data: Record<string, any>;
  signature?: string;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
  isActive: boolean;
  retryCount: number;
  timeout: number;
}

// ==================== PUSH NOTIFICATION TYPES ====================

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: string;
  sound?: string;
  clickAction?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface DeviceToken {
  userId: string;
  token: string;
  platform: 'IOS' | 'ANDROID' | 'WEB';
  isActive: boolean;
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SMS TYPES ====================

export interface SmsPayload {
  to: string;
  message: string;
  from?: string;
  mediaUrl?: string[];
  statusCallback?: string;
}

export interface SmsResponse {
  sid: string;
  status: string;
  to: string;
  from: string;
  body: string;
  dateCreated: Date;
  dateUpdated: Date;
  errorCode?: string;
  errorMessage?: string;
}

// ==================== ANALYTICS TYPES ====================

export interface NotificationMetrics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalFailed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  failureRate: number;
  averageDeliveryTime: number;
}

export interface CampaignMetrics {
  campaignId: string;
  name: string;
  status: CampaignStatus;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  failedCount: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  failureRate: number;
  averageDeliveryTime: number;
  startDate: Date;
  endDate?: Date;
}

export interface UserEngagementMetrics {
  userId: string;
  totalNotifications: number;
  totalOpened: number;
  totalClicked: number;
  averageOpenTime: number;
  preferredChannels: NotificationChannel[];
  preferredCategories: NotificationCategory[];
  engagementScore: number;
  lastActivity: Date;
}
