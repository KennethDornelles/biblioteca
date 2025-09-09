import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      console.log('🔍 PrismaService - Iniciando conexão com banco...');
      await this.$connect();
      console.log('✅ PrismaService - Conexão estabelecida com sucesso');
    } catch (error) {
      console.error('❌ PrismaService - Erro ao conectar com banco:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      console.log('🔍 PrismaService - Desconectando do banco...');
      await this.$disconnect();
      console.log('✅ PrismaService - Desconexão realizada com sucesso');
    } catch (error) {
      console.error('❌ PrismaService - Erro ao desconectar:', error);
    }
  }
}
