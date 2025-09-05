import { PrismaClient } from '@prisma/client';
import { UserType, StudentLevel, MaterialType, MaterialStatus } from '../enums';
import { appLogger } from '../utils/logger.utils';
import * as bcrypt from 'bcryptjs';
import { AUTH_CONFIG } from '../config/auth.config';

const prisma = new PrismaClient();

async function main() {
  appLogger.info('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador
  const adminPassword = await bcrypt.hash('admin123', AUTH_CONFIG.bcrypt.saltRounds);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@biblioteca.edu.br' },
    update: {},
    create: {
      name: 'Administrador do Sistema',
      email: 'admin@biblioteca.edu.br',
      phone: '(11) 99999-9999',
      password: adminPassword,
      type: UserType.ADMIN,
      active: true,
      loanLimit: 10,
      loanDays: 30,
    },
  });

  appLogger.info('✅ Usuário administrador criado:', admin.email);

  // Criar usuário bibliotecário
  const bibliotecarioPassword = await bcrypt.hash('biblio123', AUTH_CONFIG.bcrypt.saltRounds);
  const bibliotecario = await prisma.user.upsert({
    where: { email: 'bibliotecario@biblioteca.edu.br' },
    update: {},
    create: {
      name: 'Bibliotecário Principal',
      email: 'bibliotecario@biblioteca.edu.br',
      phone: '(11) 88888-8888',
      password: bibliotecarioPassword,
      type: UserType.LIBRARIAN,
      active: true,
      loanLimit: 5,
      loanDays: 15,
    },
  });

  appLogger.info('✅ Usuário bibliotecário criado:', bibliotecario.email);

  // Criar usuário aluno de exemplo
  const alunoPassword = await bcrypt.hash('aluno123', AUTH_CONFIG.bcrypt.saltRounds);
  const aluno = await prisma.user.upsert({
    where: { email: 'aluno@exemplo.edu.br' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'aluno@exemplo.edu.br',
      phone: '(11) 77777-7777',
      password: alunoPassword,
      type: UserType.STUDENT,
      active: true,
      registrationNumber: '2024001',
      course: 'Ciência da Computação',
      level: StudentLevel.UNDERGRADUATE,
      loanLimit: 3,
      loanDays: 7,
    },
  });

  appLogger.info('✅ Usuário aluno criado:', aluno.email);

  // Criar usuário professor de exemplo
  const professorPassword = await bcrypt.hash('prof123', AUTH_CONFIG.bcrypt.saltRounds);
  const professor = await prisma.user.upsert({
    where: { email: 'professor@exemplo.edu.br' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'professor@exemplo.edu.br',
      phone: '(11) 66666-6666',
      password: professorPassword,
      type: UserType.PROFESSOR,
      active: true,
      department: 'Departamento de Computação',
      title: 'Doutora',
      admissionDate: new Date('2020-03-01'),
      loanLimit: 5,
      loanDays: 21,
    },
  });

  appLogger.info('✅ Usuário professor criado:', professor.email);

  // Criar materiais de exemplo
  const material1 = await prisma.material.upsert({
    where: { isbn: '978-85-352-1234-5' },
    update: {},
    create: {
      title: 'Introdução à Programação com Python',
      author: 'Silva, João da',
      isbn: '978-85-352-1234-5',
      publisher: 'Editora Exemplo',
      publicationYear: 2023,
      edition: '3ª Edição',
      category: 'Programação',
      subcategory: 'Python',
      location: 'A-15-3',
      status: MaterialStatus.AVAILABLE,
      type: MaterialType.BOOK,
      numberOfPages: 350,
      language: 'Português',
      description: 'Livro introdutório sobre programação Python voltado para iniciantes.',
      assetNumber: 'LV001',
      acquisitionValue: 89.90,
      acquisitionDate: new Date('2023-05-15'),
      supplier: 'Distribuidora de Livros',
    },
  });

  appLogger.info('✅ Material criado:', material1.title);

  // Criar segundo material de exemplo
  const material2 = await prisma.material.upsert({
    where: { isbn: '978-85-352-5678-9' },
    update: {},
    create: {
      title: 'Algoritmos e Estruturas de Dados',
      author: 'Santos, Maria das Graças',
      isbn: '978-85-352-5678-9',
      publisher: 'Editora Técnica',
      publicationYear: 2022,
      edition: '2ª Edição',
      category: 'Ciência da Computação',
      subcategory: 'Algoritmos',
      location: 'B-08-1',
      status: MaterialStatus.AVAILABLE,
      type: MaterialType.BOOK,
      numberOfPages: 480,
      language: 'Português',
      description: 'Estudo completo sobre algoritmos e estruturas de dados.',
      assetNumber: 'LV002',
      acquisitionValue: 125.50,
      acquisitionDate: new Date('2023-06-20'),
      supplier: 'Distribuidora de Livros',
    },
  });

  appLogger.info('✅ Material criado:', material2.title);

  // Criar configurações do sistema
  const configs = [
    {
      key: 'LOAN_DURATION_DAYS',
      value: '7',
      description: 'Duração padrão de empréstimos em dias',
      type: 'NUMBER',
      category: 'EMPRESTIMOS',
    },
    {
      key: 'MAX_RENEWALS',
      value: '2',
      description: 'Número máximo de renovações por empréstimo',
      type: 'NUMBER',
      category: 'EMPRESTIMOS',
    },
    {
      key: 'FINE_VALUE_PER_DAY',
      value: '2.50',
      description: 'Valor da multa por dia de atraso',
      type: 'NUMBER',
      category: 'MULTAS',
    },
    {
      key: 'MAX_LOAN_ITEMS',
      value: '3',
      description: 'Número máximo de itens por empréstimo',
      type: 'NUMBER',
      category: 'EMPRESTIMOS',
    },
    {
      key: 'RESERVATION_DURATION_DAYS',
      value: '3',
      description: 'Duração de reservas em dias',
      type: 'NUMBER',
      category: 'RESERVAS',
    },
    {
      key: 'LIBRARY_NAME',
      value: 'Biblioteca Universitária Central',
      description: 'Nome da biblioteca',
      type: 'STRING',
      category: 'GERAL',
    },
    {
      key: 'OPERATING_HOURS',
      value: '{"monday": "8:00-22:00", "tuesday": "8:00-22:00", "wednesday": "8:00-22:00", "thursday": "8:00-22:00", "friday": "8:00-22:00", "saturday": "8:00-18:00", "sunday": "CLOSED"}',
      description: 'Horários de funcionamento da biblioteca',
      type: 'JSON',
      category: 'GERAL',
    },
  ];

  for (const config of configs) {
    await prisma.systemConfiguration.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  appLogger.info('✅ Configurações do sistema criadas');

  appLogger.info('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    appLogger.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
