import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('CategoriesController', () => {
  let service: CategoriesService;
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: mockRepository() },
      ],
      controllers: [CategoriesController],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    controller = module.get<CategoriesController>(CategoriesController);
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
});
