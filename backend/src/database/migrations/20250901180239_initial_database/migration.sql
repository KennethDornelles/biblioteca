-- CreateEnum
CREATE TYPE "tipo_usuario" AS ENUM ('ALUNO', 'PROFESSOR', 'BIBLIOTECARIO', 'ADMIN', 'FUNCIONARIO');

-- CreateEnum
CREATE TYPE "nivel_aluno" AS ENUM ('GRADUACAO', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO', 'TECNICO');

-- CreateEnum
CREATE TYPE "status_material" AS ENUM ('DISPONIVEL', 'EMPRESTADO', 'RESERVADO', 'MANUTENCAO', 'PERDIDO', 'BAIXADO');

-- CreateEnum
CREATE TYPE "tipo_material" AS ENUM ('LIVRO', 'REVISTA', 'PERIODICO', 'DVD', 'CD', 'TESE', 'DISSERTACAO', 'MONOGRAFIA', 'ARTIGO', 'MAPA', 'OUTROS');

-- CreateEnum
CREATE TYPE "status_emprestimo" AS ENUM ('ATIVO', 'DEVOLVIDO', 'ATRASADO', 'RENOVADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "status_reserva" AS ENUM ('ATIVA', 'ATENDIDA', 'EXPIRADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "status_multa" AS ENUM ('PENDENTE', 'PAGA', 'CANCELADA', 'PARCELADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20),
    "senha" VARCHAR(255) NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "tipo_usuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "matricula" VARCHAR(20),
    "curso" VARCHAR(255),
    "nivel" "nivel_aluno",
    "departamento" VARCHAR(255),
    "titulacao" VARCHAR(100),
    "dataAdmissao" TIMESTAMP(3),
    "limiteEmprestimos" INTEGER NOT NULL DEFAULT 3,
    "diasEmprestimo" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiais" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(500) NOT NULL,
    "autor" VARCHAR(255) NOT NULL,
    "isbn" VARCHAR(20),
    "issn" VARCHAR(20),
    "editora" VARCHAR(255),
    "anoPublicacao" INTEGER,
    "edicao" VARCHAR(50),
    "categoria" VARCHAR(100) NOT NULL,
    "subcategoria" VARCHAR(100),
    "localizacao" VARCHAR(50) NOT NULL,
    "status" "status_material" NOT NULL DEFAULT 'DISPONIVEL',
    "tipo" "tipo_material" NOT NULL DEFAULT 'LIVRO',
    "numeroPaginas" INTEGER,
    "idioma" VARCHAR(50) NOT NULL DEFAULT 'Português',
    "descricao" TEXT,
    "palavrasChave" TEXT,
    "numeroPatrimonio" VARCHAR(20),
    "valorAquisicao" DECIMAL(10,2),
    "dataAquisicao" TIMESTAMP(3),
    "fornecedor" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emprestimos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "bibliotecarioId" TEXT,
    "dataEmprestimo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevista" TIMESTAMP(3) NOT NULL,
    "dataDevolucao" TIMESTAMP(3),
    "dataRenovacao" TIMESTAMP(3),
    "status" "status_emprestimo" NOT NULL DEFAULT 'ATIVO',
    "renovacoes" INTEGER NOT NULL DEFAULT 0,
    "maxRenovacoes" INTEGER NOT NULL DEFAULT 2,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emprestimos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "dataReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3) NOT NULL,
    "status" "status_reserva" NOT NULL DEFAULT 'ATIVA',
    "prioridade" INTEGER NOT NULL DEFAULT 1,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multas" (
    "id" TEXT NOT NULL,
    "emprestimoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "diasAtraso" INTEGER NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" "status_multa" NOT NULL DEFAULT 'PENDENTE',
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "multas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "nota" SMALLINT NOT NULL,
    "comentario" TEXT,
    "dataAvaliacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_sistema" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" VARCHAR(50) NOT NULL,
    "categoria" VARCHAR(100) NOT NULL,
    "editavel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_matricula_idx" ON "usuarios"("matricula");

-- CreateIndex
CREATE INDEX "usuarios_tipo_idx" ON "usuarios"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "materiais_isbn_key" ON "materiais"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "materiais_numeroPatrimonio_key" ON "materiais"("numeroPatrimonio");

-- CreateIndex
CREATE INDEX "materiais_titulo_idx" ON "materiais"("titulo");

-- CreateIndex
CREATE INDEX "materiais_autor_idx" ON "materiais"("autor");

-- CreateIndex
CREATE INDEX "materiais_isbn_idx" ON "materiais"("isbn");

-- CreateIndex
CREATE INDEX "materiais_categoria_idx" ON "materiais"("categoria");

-- CreateIndex
CREATE INDEX "materiais_status_idx" ON "materiais"("status");

-- CreateIndex
CREATE INDEX "emprestimos_usuarioId_idx" ON "emprestimos"("usuarioId");

-- CreateIndex
CREATE INDEX "emprestimos_materialId_idx" ON "emprestimos"("materialId");

-- CreateIndex
CREATE INDEX "emprestimos_status_idx" ON "emprestimos"("status");

-- CreateIndex
CREATE INDEX "emprestimos_dataEmprestimo_idx" ON "emprestimos"("dataEmprestimo");

-- CreateIndex
CREATE INDEX "emprestimos_dataPrevista_idx" ON "emprestimos"("dataPrevista");

-- CreateIndex
CREATE INDEX "reservas_usuarioId_idx" ON "reservas"("usuarioId");

-- CreateIndex
CREATE INDEX "reservas_materialId_idx" ON "reservas"("materialId");

-- CreateIndex
CREATE INDEX "reservas_status_idx" ON "reservas"("status");

-- CreateIndex
CREATE INDEX "reservas_dataExpiracao_idx" ON "reservas"("dataExpiracao");

-- CreateIndex
CREATE INDEX "multas_usuarioId_idx" ON "multas"("usuarioId");

-- CreateIndex
CREATE INDEX "multas_status_idx" ON "multas"("status");

-- CreateIndex
CREATE INDEX "multas_dataVencimento_idx" ON "multas"("dataVencimento");

-- CreateIndex
CREATE INDEX "avaliacoes_materialId_idx" ON "avaliacoes"("materialId");

-- CreateIndex
CREATE INDEX "avaliacoes_nota_idx" ON "avaliacoes"("nota");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_usuarioId_materialId_key" ON "avaliacoes"("usuarioId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_sistema_chave_key" ON "configuracoes_sistema"("chave");

-- CreateIndex
CREATE INDEX "configuracoes_sistema_categoria_idx" ON "configuracoes_sistema"("categoria");

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_bibliotecarioId_fkey" FOREIGN KEY ("bibliotecarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multas" ADD CONSTRAINT "multas_emprestimoId_fkey" FOREIGN KEY ("emprestimoId") REFERENCES "emprestimos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multas" ADD CONSTRAINT "multas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
