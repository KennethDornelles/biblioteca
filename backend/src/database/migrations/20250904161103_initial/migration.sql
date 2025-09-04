/*
  Warnings:

  - You are about to drop the column `renewals` on the `loans` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('SYSTEM', 'LOAN', 'RESERVATION', 'FINE', 'SECURITY', 'MAINTENANCE', 'MARKETING', 'REMINDER', 'ALERT', 'WELCOME', 'PASSWORD_RESET', 'ACCOUNT_VERIFICATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "notification_category" AS ENUM ('URGENT', 'IMPORTANT', 'INFO', 'WARNING', 'SUCCESS', 'ERROR', 'PROMOTIONAL', 'SECURITY');

-- CreateEnum
CREATE TYPE "notification_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "notification_status" AS ENUM ('PENDING', 'SCHEDULED', 'SENDING', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "notification_channel" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WEBHOOK', 'SLACK', 'TEAMS', 'DISCORD');

-- CreateEnum
CREATE TYPE "delivery_status" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED', 'BOUNCED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "notification_frequency" AS ENUM ('IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "digest_frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "campaign_status" AS ENUM ('DRAFT', 'SCHEDULED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "analytics_event" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED', 'BOUNCED', 'UNSUBSCRIBED', 'COMPLAINED');

-- CreateEnum
CREATE TYPE "DevicePlatform" AS ENUM ('IOS', 'ANDROID', 'WEB');

-- AlterTable
ALTER TABLE "loans" DROP COLUMN "renewals",
ADD COLUMN     "renewalCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "type" "notification_type" NOT NULL,
    "category" "notification_category" NOT NULL,
    "priority" "notification_priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "notification_status" NOT NULL DEFAULT 'PENDING',
    "channel" "notification_channel" NOT NULL,
    "templateId" TEXT,
    "data" JSONB,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "errorMessage" TEXT,
    "deliveryStatus" "delivery_status" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "type" "notification_type" NOT NULL,
    "category" "notification_category" NOT NULL,
    "channel" "notification_channel" NOT NULL,
    "variables" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "webhookEnabled" BOOLEAN NOT NULL DEFAULT false,
    "webhookUrl" TEXT,
    "quietHoursStart" VARCHAR(5),
    "quietHoursEnd" VARCHAR(5),
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'America/Sao_Paulo',
    "language" VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
    "categories" JSONB NOT NULL,
    "channels" JSONB NOT NULL,
    "frequency" "notification_frequency" NOT NULL DEFAULT 'IMMEDIATE',
    "digestEnabled" BOOLEAN NOT NULL DEFAULT false,
    "digestFrequency" "digest_frequency" NOT NULL DEFAULT 'DAILY',
    "digestTime" VARCHAR(5) NOT NULL DEFAULT '09:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_campaigns" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "notification_type" NOT NULL,
    "category" "notification_category" NOT NULL,
    "channel" "notification_channel" NOT NULL,
    "templateId" TEXT,
    "targetUsers" JSONB NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "openedCount" INTEGER NOT NULL DEFAULT 0,
    "clickedCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_analytics" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT,
    "campaignId" TEXT,
    "userId" TEXT NOT NULL,
    "event" "analytics_event" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "os" TEXT,

    CONSTRAINT "notification_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" "DevicePlatform" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_category_idx" ON "notifications"("category");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_channel_idx" ON "notifications"("channel");

-- CreateIndex
CREATE INDEX "notifications_scheduledFor_idx" ON "notifications"("scheduledFor");

-- CreateIndex
CREATE INDEX "notifications_sentAt_idx" ON "notifications"("sentAt");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_name_key" ON "notification_templates"("name");

-- CreateIndex
CREATE INDEX "notification_templates_type_idx" ON "notification_templates"("type");

-- CreateIndex
CREATE INDEX "notification_templates_category_idx" ON "notification_templates"("category");

-- CreateIndex
CREATE INDEX "notification_templates_channel_idx" ON "notification_templates"("channel");

-- CreateIndex
CREATE INDEX "notification_templates_isActive_idx" ON "notification_templates"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_preferences_userId_key" ON "user_notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "notification_campaigns_type_idx" ON "notification_campaigns"("type");

-- CreateIndex
CREATE INDEX "notification_campaigns_category_idx" ON "notification_campaigns"("category");

-- CreateIndex
CREATE INDEX "notification_campaigns_status_idx" ON "notification_campaigns"("status");

-- CreateIndex
CREATE INDEX "notification_campaigns_scheduledFor_idx" ON "notification_campaigns"("scheduledFor");

-- CreateIndex
CREATE INDEX "notification_analytics_notificationId_idx" ON "notification_analytics"("notificationId");

-- CreateIndex
CREATE INDEX "notification_analytics_campaignId_idx" ON "notification_analytics"("campaignId");

-- CreateIndex
CREATE INDEX "notification_analytics_userId_idx" ON "notification_analytics"("userId");

-- CreateIndex
CREATE INDEX "notification_analytics_event_idx" ON "notification_analytics"("event");

-- CreateIndex
CREATE INDEX "notification_analytics_timestamp_idx" ON "notification_analytics"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_token_key" ON "device_tokens"("token");

-- CreateIndex
CREATE INDEX "device_tokens_userId_idx" ON "device_tokens"("userId");

-- CreateIndex
CREATE INDEX "device_tokens_isActive_idx" ON "device_tokens"("isActive");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "notification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_campaigns" ADD CONSTRAINT "notification_campaigns_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "notification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
