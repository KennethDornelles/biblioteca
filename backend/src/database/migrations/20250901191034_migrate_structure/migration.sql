/*
  Warnings:

  - You are about to drop the `avaliacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `configuracoes_sistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emprestimos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materiais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `multas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "student_level" AS ENUM ('UNDERGRADUATE', 'POSTGRADUATE', 'MASTERS', 'DOCTORATE', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "material_status" AS ENUM ('AVAILABLE', 'LOANED', 'RESERVED', 'MAINTENANCE', 'LOST', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "material_type" AS ENUM ('BOOK', 'MAGAZINE', 'JOURNAL', 'DVD', 'CD', 'THESIS', 'DISSERTATION', 'MONOGRAPH', 'ARTICLE', 'MAP', 'OTHER');

-- CreateEnum
CREATE TYPE "loan_status" AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE', 'RENEWED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "reservation_status" AS ENUM ('ACTIVE', 'FULFILLED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "fine_status" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'INSTALLMENT');

-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_materialId_fkey";

-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "emprestimos" DROP CONSTRAINT "emprestimos_bibliotecarioId_fkey";

-- DropForeignKey
ALTER TABLE "emprestimos" DROP CONSTRAINT "emprestimos_materialId_fkey";

-- DropForeignKey
ALTER TABLE "emprestimos" DROP CONSTRAINT "emprestimos_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "multas" DROP CONSTRAINT "multas_emprestimoId_fkey";

-- DropForeignKey
ALTER TABLE "multas" DROP CONSTRAINT "multas_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_materialId_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_usuarioId_fkey";

-- DropTable
DROP TABLE "avaliacoes";

-- DropTable
DROP TABLE "configuracoes_sistema";

-- DropTable
DROP TABLE "emprestimos";

-- DropTable
DROP TABLE "materiais";

-- DropTable
DROP TABLE "multas";

-- DropTable
DROP TABLE "reservas";

-- DropTable
DROP TABLE "usuarios";

-- DropEnum
DROP TYPE "nivel_aluno";

-- DropEnum
DROP TYPE "status_emprestimo";

-- DropEnum
DROP TYPE "status_material";

-- DropEnum
DROP TYPE "status_multa";

-- DropEnum
DROP TYPE "status_reserva";

-- DropEnum
DROP TYPE "tipo_material";

-- DropEnum
DROP TYPE "tipo_usuario";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "user_type" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "registrationNumber" VARCHAR(20),
    "course" VARCHAR(255),
    "level" "student_level",
    "department" VARCHAR(255),
    "title" VARCHAR(100),
    "admissionDate" TIMESTAMP(3),
    "loanLimit" INTEGER NOT NULL DEFAULT 3,
    "loanDays" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "isbn" VARCHAR(20),
    "issn" VARCHAR(20),
    "publisher" VARCHAR(255),
    "publicationYear" INTEGER,
    "edition" VARCHAR(50),
    "category" VARCHAR(100) NOT NULL,
    "subcategory" VARCHAR(100),
    "location" VARCHAR(50) NOT NULL,
    "status" "material_status" NOT NULL DEFAULT 'AVAILABLE',
    "type" "material_type" NOT NULL DEFAULT 'BOOK',
    "numberOfPages" INTEGER,
    "language" VARCHAR(50) NOT NULL DEFAULT 'Português',
    "description" TEXT,
    "keywords" TEXT,
    "assetNumber" VARCHAR(20),
    "acquisitionValue" DECIMAL(10,2),
    "acquisitionDate" TIMESTAMP(3),
    "supplier" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "librarianId" TEXT,
    "loanDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "status" "loan_status" NOT NULL DEFAULT 'ACTIVE',
    "renewals" INTEGER NOT NULL DEFAULT 0,
    "maxRenewals" INTEGER NOT NULL DEFAULT 2,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "status" "reservation_status" NOT NULL DEFAULT 'ACTIVE',
    "priority" INTEGER NOT NULL DEFAULT 1,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fines" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "daysOverdue" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "status" "fine_status" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "reviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configurations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "type" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "editable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_registrationNumber_idx" ON "users"("registrationNumber");

-- CreateIndex
CREATE INDEX "users_type_idx" ON "users"("type");

-- CreateIndex
CREATE UNIQUE INDEX "users_registrationNumber_key" ON "users"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "materials_isbn_key" ON "materials"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "materials_assetNumber_key" ON "materials"("assetNumber");

-- CreateIndex
CREATE INDEX "materials_title_idx" ON "materials"("title");

-- CreateIndex
CREATE INDEX "materials_author_idx" ON "materials"("author");

-- CreateIndex
CREATE INDEX "materials_isbn_idx" ON "materials"("isbn");

-- CreateIndex
CREATE INDEX "materials_category_idx" ON "materials"("category");

-- CreateIndex
CREATE INDEX "materials_status_idx" ON "materials"("status");

-- CreateIndex
CREATE INDEX "loans_userId_idx" ON "loans"("userId");

-- CreateIndex
CREATE INDEX "loans_materialId_idx" ON "loans"("materialId");

-- CreateIndex
CREATE INDEX "loans_status_idx" ON "loans"("status");

-- CreateIndex
CREATE INDEX "loans_loanDate_idx" ON "loans"("loanDate");

-- CreateIndex
CREATE INDEX "loans_dueDate_idx" ON "loans"("dueDate");

-- CreateIndex
CREATE INDEX "reservations_userId_idx" ON "reservations"("userId");

-- CreateIndex
CREATE INDEX "reservations_materialId_idx" ON "reservations"("materialId");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");

-- CreateIndex
CREATE INDEX "reservations_expirationDate_idx" ON "reservations"("expirationDate");

-- CreateIndex
CREATE INDEX "fines_userId_idx" ON "fines"("userId");

-- CreateIndex
CREATE INDEX "fines_status_idx" ON "fines"("status");

-- CreateIndex
CREATE INDEX "fines_dueDate_idx" ON "fines"("dueDate");

-- CreateIndex
CREATE INDEX "reviews_materialId_idx" ON "reviews"("materialId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_materialId_key" ON "reviews"("userId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "system_configurations_key_key" ON "system_configurations"("key");

-- CreateIndex
CREATE INDEX "system_configurations_category_idx" ON "system_configurations"("category");

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_librarianId_fkey" FOREIGN KEY ("librarianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fines" ADD CONSTRAINT "fines_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fines" ADD CONSTRAINT "fines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
