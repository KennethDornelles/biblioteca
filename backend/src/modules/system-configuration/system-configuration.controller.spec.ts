import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigurationController } from './system-configuration.controller';
import { SystemConfigurationService } from './system-configuration.service';

describe('SystemConfigurationController', () => {
  let controller: SystemConfigurationController;
  let service: SystemConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemConfigurationController],
      providers: [
        {
          provide: SystemConfigurationService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByKey: jest.fn(),
            update: jest.fn(),
            updateByKey: jest.fn(),
            remove: jest.fn(),
            findByCategory: jest.fn(),
            getByCategories: jest.fn(),
            getSystemSettings: jest.fn(),
            initializeDefaultConfigurations: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SystemConfigurationController>(SystemConfigurationController);
    service = module.get<SystemConfigurationService>(SystemConfigurationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a system configuration', async () => {
      const createDto = {
        key: 'test.key',
        value: 'test value',
        description: 'Test description',
        type: 'string',
        category: 'test'
      };
      const expectedResult = { id: 'config123', ...createDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      expect(await controller.create(createDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated configurations', async () => {
      const filters = { page: 1, limit: 10 };
      const expectedResult = {
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      expect(await controller.findAll(filters)).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('getByCategories', () => {
    it('should return configurations grouped by category', async () => {
      const expectedResult = [
        {
          category: 'library',
          configurations: []
        }
      ];

      jest.spyOn(service, 'getByCategories').mockResolvedValue(expectedResult);

      expect(await controller.getByCategories()).toBe(expectedResult);
      expect(service.getByCategories).toHaveBeenCalled();
    });
  });

  describe('getSystemSettings', () => {
    it('should return system settings', async () => {
      const expectedResult = {
        library: {
          name: 'Test Library',
          address: 'Test Address',
          phone: 'Test Phone',
          email: 'test@email.com',
          workingHours: 'Test Hours'
        },
        loans: {
          defaultLoanDays: 7,
          maxRenewals: 2,
          maxLoansPerUser: 3,
          overdueFinePerDay: 0.50
        },
        reservations: {
          maxReservationsPerUser: 5,
          reservationExpirationDays: 3
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          reminderDaysBefore: 1
        }
      };

      jest.spyOn(service, 'getSystemSettings').mockResolvedValue(expectedResult);

      expect(await controller.getSystemSettings()).toBe(expectedResult);
      expect(service.getSystemSettings).toHaveBeenCalled();
    });
  });

  describe('findByCategory', () => {
    it('should return configurations by category', async () => {
      const category = 'library';
      const expectedResult = [
        { id: 'config1', key: 'library.name', value: 'Test Library' }
      ];

      jest.spyOn(service, 'findByCategory').mockResolvedValue(expectedResult as any);

      expect(await controller.findByCategory(category)).toBe(expectedResult);
      expect(service.findByCategory).toHaveBeenCalledWith(category);
    });
  });

  describe('findByKey', () => {
    it('should return configuration by key', async () => {
      const key = 'library.name';
      const expectedResult = { id: 'config1', key, value: 'Test Library' };

      jest.spyOn(service, 'findByKey').mockResolvedValue(expectedResult as any);

      expect(await controller.findByKey(key)).toBe(expectedResult);
      expect(service.findByKey).toHaveBeenCalledWith(key);
    });
  });

  describe('findOne', () => {
    it('should return configuration by id', async () => {
      const id = 'config123';
      const expectedResult = { id, key: 'test.key', value: 'test value' };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as any);

      expect(await controller.findOne(id)).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update configuration', async () => {
      const id = 'config123';
      const updateDto = { value: 'updated value' };
      const expectedResult = { id, key: 'test.key', value: 'updated value' };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      expect(await controller.update(id, updateDto)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('updateByKey', () => {
    it('should update configuration by key', async () => {
      const key = 'test.key';
      const value = 'updated value';
      const expectedResult = { id: 'config123', key, value };

      jest.spyOn(service, 'updateByKey').mockResolvedValue(expectedResult as any);

      expect(await controller.updateByKey(key, value)).toBe(expectedResult);
      expect(service.updateByKey).toHaveBeenCalledWith(key, value);
    });
  });

  describe('remove', () => {
    it('should remove configuration', async () => {
      const id = 'config123';

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('initializeDefaultConfigurations', () => {
    it('should initialize default configurations', async () => {
      jest.spyOn(service, 'initializeDefaultConfigurations').mockResolvedValue(undefined);

      await controller.initializeDefaultConfigurations();
      expect(service.initializeDefaultConfigurations).toHaveBeenCalled();
    });
  });
});
