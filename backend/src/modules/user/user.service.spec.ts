import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { UserType, StudentLevel } from '../../enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

// Mock do PrismaClient
const mockPrisma = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  loan: {
    count: jest.fn(),
  },
  reservation: {
    count: jest.fn(),
  },
  $disconnect: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'senha123',
      type: UserType.STUDENT,
      registrationNumber: '2023001',
      course: 'Ciência da Computação',
      level: StudentLevel.UNDERGRADUATE,
    };

    it('should create a user successfully', async () => {
      const mockUser = {
        id: '1',
        ...createUserDto,
        password: 'hashedPassword',
        registrationDate: new Date(),
        active: true,
        loanLimit: 3,
        loanDays: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createUserDto.name);
      expect(result.email).toBe(createUserDto.email);
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'joao@email.com' });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if registration number already exists', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: '1', registrationNumber: '2023001' });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'hashedPassword',
        registrationDate: new Date(),
        type: UserType.STUDENT,
        active: true,
        loanLimit: 3,
        loanDays: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'João Silva Atualizado',
    };

    it('should update a user successfully', async () => {
      const existingUser = {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'hashedPassword',
        registrationDate: new Date(),
        type: UserType.STUDENT,
        active: true,
        loanLimit: 3,
        loanDays: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = { ...existingUser, ...updateUserDto };

      mockPrisma.user.findUnique
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateUserDto.name);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.update('1', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'hashedPassword',
        registrationDate: new Date(),
        type: UserType.STUDENT,
        active: true,
        loanLimit: 3,
        loanDays: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.loan.count.mockResolvedValue(0);
      mockPrisma.reservation.count.mockResolvedValue(0);
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(result.message).toBe('Usuário excluído com sucesso');
    });

    it('should throw BadRequestException if user has active loans', async () => {
      const mockUser = {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'hashedPassword',
        registrationDate: new Date(),
        type: UserType.STUDENT,
        active: true,
        loanLimit: 3,
        loanDays: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.loan.count.mockResolvedValue(1);

      await expect(service.remove('1')).rejects.toThrow(BadRequestException);
    });
  });
});
