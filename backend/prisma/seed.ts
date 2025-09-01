import { PrismaClient, TipoUsuario, NivelAluno, StatusMaterial, TipoMaterial } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@biblioteca.edu.br' },
    update: {},
    create: {
      nome: 'Administrador do Sistema',
      email: 'admin@biblioteca.edu.br',
      telefone: '(11) 99999-9999',
      senha: adminPassword,
      tipo: TipoUsuario.ADMIN,
      ativo: true,
      limiteEmprestimos: 10,
      diasEmprestimo: 30,
    },
  });

  console.log('✅ Usuário administrador criado:', admin.email);

  // Criar usuário bibliotecário
  const bibliotecarioPassword = await bcrypt.hash('biblio123', 12);
  const bibliotecario = await prisma.usuario.upsert({
    where: { email: 'bibliotecario@biblioteca.edu.br' },
    update: {},
    create: {
      nome: 'Bibliotecário Principal',
      email: 'bibliotecario@biblioteca.edu.br',
      telefone: '(11) 88888-8888',
      senha: bibliotecarioPassword,
      tipo: TipoUsuario.BIBLIOTECARIO,
      ativo: true,
      limiteEmprestimos: 5,
      diasEmprestimo: 15,
    },
  });

  console.log('✅ Usuário bibliotecário criado:', bibliotecario.email);

  // Criar usuário aluno de exemplo
  const alunoPassword = await bcrypt.hash('aluno123', 12);
  const aluno = await prisma.usuario.upsert({
    where: { email: 'aluno@exemplo.edu.br' },
    update: {},
    create: {
      nome: 'João Silva',
      email: 'aluno@exemplo.edu.br',
      telefone: '(11) 77777-7777',
      senha: alunoPassword,
      tipo: TipoUsuario.ALUNO,
      ativo: true,
      matricula: '2024001',
      curso: 'Ciência da Computação',
      nivel: NivelAluno.GRADUACAO,
      limiteEmprestimos: 3,
      diasEmprestimo: 7,
    },
  });

  console.log('✅ Usuário aluno criado:', aluno.email);

  // Criar usuário professor de exemplo
  const professorPassword = await bcrypt.hash('prof123', 12);
  const professor = await prisma.usuario.upsert({
    where: { email: 'professor@exemplo.edu.br' },
    update: {},
    create: {
      nome: 'Maria Santos',
      email: 'professor@exemplo.edu.br',
      telefone: '(11) 66666-6666',
      senha: professorPassword,
      tipo: TipoUsuario.PROFESSOR,
      ativo: true,
      departamento: 'Departamento de Computação',
      titulacao: 'Doutora',
      dataAdmissao: new Date('2020-03-01'),
      limiteEmprestimos: 5,
      diasEmprestimo: 21,
    },
  });

  console.log('✅ Usuário professor criado:', professor.email);

  // Criar materiais de exemplo
  const material1 = await prisma.material.upsert({
    where: { isbn: '978-85-352-1234-5' },
    update: {},
    create: {
      titulo: 'Introdução à Programação com Python',
      autor: 'Silva, João da',
      isbn: '978-85-352-1234-5',
      editora: 'Editora Exemplo',
      anoPublicacao: 2023,
      edicao: '1ª Edição',
      categoria: 'Computação',
      subcategoria: 'Programação',
      localizacao: 'A-15-3',
      status: StatusMaterial.DISPONIVEL,
      tipo: TipoMaterial.LIVRO,
      numeroPaginas: 350,
      idioma: 'Português',
      descricao: 'Livro introdutório sobre programação em Python',
      palavrasChave: '["python", "programação", "iniciante"]',
      numeroPatrimonio: 'PAT-001',
      valorAquisicao: 89.90,
      dataAquisicao: new Date('2023-01-15'),
      fornecedor: 'Distribuidora Exemplo',
    },
  });

  console.log('✅ Material criado:', material1.titulo);

  const material2 = await prisma.material.upsert({
    where: { isbn: '978-85-352-5678-9' },
    update: {},
    create: {
      titulo: 'Algoritmos e Estruturas de Dados',
      autor: 'Santos, Maria dos',
      isbn: '978-85-352-5678-9',
      editora: 'Editora Exemplo',
      anoPublicacao: 2022,
      edicao: '2ª Edição',
      categoria: 'Computação',
      subcategoria: 'Algoritmos',
      localizacao: 'A-15-4',
      status: StatusMaterial.DISPONIVEL,
      tipo: TipoMaterial.LIVRO,
      numeroPaginas: 420,
      idioma: 'Português',
      descricao: 'Livro sobre algoritmos e estruturas de dados fundamentais',
      palavrasChave: '["algoritmos", "estruturas de dados", "computação"]',
      numeroPatrimonio: 'PAT-002',
      valorAquisicao: 95.50,
      dataAquisicao: new Date('2022-08-20'),
      fornecedor: 'Distribuidora Exemplo',
    },
  });

  console.log('✅ Material criado:', material2.titulo);

  // Criar configurações do sistema
  const configs = [
    {
      chave: 'DIAS_EMPRESTIMO_ALUNO',
      valor: '7',
      descricao: 'Número de dias para empréstimo de alunos',
      tipo: 'NUMBER',
      categoria: 'emprestimos',
    },
    {
      chave: 'DIAS_EMPRESTIMO_PROFESSOR',
      valor: '21',
      descricao: 'Número de dias para empréstimo de professores',
      tipo: 'NUMBER',
      categoria: 'emprestimos',
    },
    {
      chave: 'LIMITE_EMPRESTIMOS_ALUNO',
      valor: '3',
      descricao: 'Limite de empréstimos simultâneos para alunos',
      tipo: 'NUMBER',
      categoria: 'emprestimos',
    },
    {
      chave: 'LIMITE_EMPRESTIMOS_PROFESSOR',
      valor: '5',
      descricao: 'Limite de empréstimos simultâneos para professores',
      tipo: 'NUMBER',
      categoria: 'emprestimos',
    },
    {
      chave: 'MULTA_POR_DIA_ATRASO',
      valor: '2.50',
      descricao: 'Valor da multa por dia de atraso',
      tipo: 'NUMBER',
      categoria: 'multas',
    },
    {
      chave: 'DIAS_RESERVA_EXPIRACAO',
      valor: '3',
      descricao: 'Número de dias para expiração de reservas',
      tipo: 'NUMBER',
      categoria: 'reservas',
    },
  ];

  for (const config of configs) {
    await prisma.configuracaoSistema.upsert({
      where: { chave: config.chave },
      update: {},
      create: config,
    });
  }

  console.log('✅ Configurações do sistema criadas');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
