import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../../user/user.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;
  let userService: UserService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data when payload is valid and user exists', async () => {
      const mockPayload = {
        sub: 'user_id',
        email: 'test@example.com',
        type: 'STUDENT',
        name: 'Test User',
      };

      const mockUser = {
        id: 'user_id',
        email: 'test@example.com',
        type: 'STUDENT',
        name: 'Test User',
        active: true,
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        sub: 'user_id',
        email: 'test@example.com',
        type: 'STUDENT',
        name: 'Test User',
        active: true,
      });
      expect(userService.findById).toHaveBeenCalledWith('user_id');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const mockPayload = {
        sub: 'nonexistent_user',
        email: 'test@example.com',
        type: 'STUDENT',
        name: 'Test User',
      };

      mockUserService.findById.mockResolvedValue(null);

      await expect(strategy.validate(mockPayload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const mockPayload = {
        sub: 'user_id',
        email: 'test@example.com',
        type: 'STUDENT',
        name: 'Test User',
      };

      const mockUser = {
        id: 'user_id',
        email: 'test@example.com',
        type: 'STUDENT',
        name: 'Test User',
        active: false,
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      await expect(strategy.validate(mockPayload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when userService.findById throws error', async () => {
      const mockPayload = {
        sub: 'user_id',
        email: 'test@example.com',
        type: 'STUDENT',
        name: 'Test User',
      };

      mockUserService.findById.mockRejectedValue(new Error('Database error'));

      await expect(strategy.validate(mockPayload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
