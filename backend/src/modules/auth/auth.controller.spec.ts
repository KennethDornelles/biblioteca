import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login response when credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          type: 'STUDENT',
          active: true,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid_refresh_token',
      };

      const expectedResponse = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
    });
  });

  describe('logout', () => {
    it('should return logout response', async () => {
      const expectedResponse = {
        message: 'Logout realizado com sucesso',
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockAuthService.logout.mockResolvedValue(expectedResponse);

      const result = await controller.logout();

      expect(result).toEqual(expectedResponse);
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        type: 'STUDENT',
        active: true,
      };

      const mockRequest = {
        user: {
          sub: '1',
          email: 'test@example.com',
          type: 'STUDENT',
          name: 'Test User',
        },
      };

      mockAuthService.getProfile.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
      expect(authService.getProfile).toHaveBeenCalledWith('1');
    });
  });
});
