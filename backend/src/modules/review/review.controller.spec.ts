import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByUser: jest.fn(),
            findByMaterial: jest.fn(),
            getStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a review', async () => {
      const createReviewDto = {
        userId: 'user123',
        materialId: 'material123',
        rating: 5,
        comment: 'Great book!'
      };
      const expectedResult = { id: 'review123', ...createReviewDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      expect(await controller.create(createReviewDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createReviewDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated reviews', async () => {
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

  describe('findOne', () => {
    it('should return a review by id', async () => {
      const id = 'review123';
      const expectedResult = { id, userId: 'user123', materialId: 'material123', rating: 5 };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as any);

      expect(await controller.findOne(id)).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const id = 'review123';
      const updateReviewDto = { rating: 4, comment: 'Updated comment' };
      const expectedResult = { id, ...updateReviewDto };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      expect(await controller.update(id, updateReviewDto)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateReviewDto);
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const id = 'review123';

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('findByUser', () => {
    it('should return reviews by user', async () => {
      const userId = 'user123';
      const page = 1;
      const limit = 10;
      const expectedResult = {
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      };

      jest.spyOn(service, 'findByUser').mockResolvedValue(expectedResult);

      expect(await controller.findByUser(userId, page, limit)).toBe(expectedResult);
      expect(service.findByUser).toHaveBeenCalledWith(userId, page, limit);
    });
  });

  describe('findByMaterial', () => {
    it('should return reviews by material', async () => {
      const materialId = 'material123';
      const page = 1;
      const limit = 10;
      const expectedResult = {
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      };

      jest.spyOn(service, 'findByMaterial').mockResolvedValue(expectedResult);

      expect(await controller.findByMaterial(materialId, page, limit)).toBe(expectedResult);
      expect(service.findByMaterial).toHaveBeenCalledWith(materialId, page, limit);
    });
  });

  describe('getStats', () => {
    it('should return review statistics', async () => {
      const expectedResult = {
        total: 100,
        averageRating: 4.2,
        ratingDistribution: { 1: 5, 2: 10, 3: 20, 4: 35, 5: 30 },
        totalWithComments: 80,
        totalWithoutComments: 20
      };

      jest.spyOn(service, 'getStats').mockResolvedValue(expectedResult);

      expect(await controller.getStats()).toBe(expectedResult);
      expect(service.getStats).toHaveBeenCalled();
    });
  });
});
