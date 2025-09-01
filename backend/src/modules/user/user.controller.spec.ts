import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType, StudentLevel } from '../../enums';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    changePassword: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    remove: jest.fn(),
    findByType: jest.fn(),
    findByCourse: jest.fn(),
    findByDepartment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should create a user', async () => {
      const expectedResult = {
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

      mockUserService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const filters = { page: 1, limit: 10 };
      const expectedResult = {
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      mockUserService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(filters);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const expectedResult = {
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

      mockUserService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(userId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'joao@email.com';
      const expectedResult = {
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

      mockUserService.findByEmail.mockResolvedValue(expectedResult);

      const result = await controller.findByEmail(email);

      expect(result).toEqual(expectedResult);
      expect(service.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'João Silva Atualizado',
    };

    it('should update a user', async () => {
      const userId = '1';
      const expectedResult = {
        id: '1',
        name: 'João Silva Atualizado',
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

      mockUserService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(userId, updateUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'senha123',
      newPassword: 'novaSenha123',
      confirmPassword: 'novaSenha123',
    };

    it('should change user password', async () => {
      const userId = '1';
      const expectedResult = { message: 'Senha alterada com sucesso' };

      mockUserService.changePassword.mockResolvedValue(expectedResult);

      const result = await controller.changePassword(userId, changePasswordDto);

      expect(result).toEqual(expectedResult);
      expect(service.changePassword).toHaveBeenCalledWith(userId, changePasswordDto);
    });
  });

  describe('activate', () => {
    it('should activate a user', async () => {
      const userId = '1';
      const expectedResult = {
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

      mockUserService.activate.mockResolvedValue(expectedResult);

      const result = await controller.activate(userId);

      expect(result).toEqual(expectedResult);
      expect(service.activate).toHaveBeenCalledWith(userId);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a user', async () => {
      const userId = '1';
      const expectedResult = {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'hashedPassword',
        registrationDate: new Date(),
        type: UserType.STUDENT,
        active: false,
        loanLimit: 3,
        loanDays: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.deactivate.mockResolvedValue(expectedResult);

      const result = await controller.deactivate(userId);

      expect(result).toEqual(expectedResult);
      expect(service.deactivate).toHaveBeenCalledWith(userId);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';

      mockUserService.remove.mockResolvedValue(undefined);

      await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledWith(userId);
    });
  });

  describe('findByType', () => {
    it('should return users by type', async () => {
      const userType = UserType.STUDENT;
      const expectedResult = [
        {
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
        },
      ];

      mockUserService.findByType.mockResolvedValue(expectedResult);

      const result = await controller.findByType(userType);

      expect(result).toEqual(expectedResult);
      expect(service.findByType).toHaveBeenCalledWith(userType);
    });
  });

  describe('findByCourse', () => {
    it('should return users by course', async () => {
      const course = 'Ciência da Computação';
      const expectedResult = [
        {
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
        },
      ];

      mockUserService.findByCourse.mockResolvedValue(expectedResult);

      const result = await controller.findByCourse(course);

      expect(result).toEqual(expectedResult);
      expect(service.findByCourse).toHaveBeenCalledWith(course);
    });
  });

  describe('findByDepartment', () => {
    it('should return users by department', async () => {
      const department = 'Departamento de Computação';
      const expectedResult = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          password: 'hashedPassword',
          registrationDate: new Date(),
          type: UserType.PROFESSOR,
          active: true,
          loanLimit: 3,
          loanDays: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserService.findByDepartment.mockResolvedValue(expectedResult);

      const result = await controller.findByDepartment(department);

      expect(result).toEqual(expectedResult);
      expect(service.findByDepartment).toHaveBeenCalledWith(department);
    });
  });
});
