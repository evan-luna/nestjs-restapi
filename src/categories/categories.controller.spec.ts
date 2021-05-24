import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
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
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository(),
        },
      ],
      controllers: [CategoriesController],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    controller = module.get<CategoriesController>(CategoriesController);
  });

  describe('POST /categories', () => {
    it('카테고리가 생성 되어야 한다.', async () => {
      const createCategoryInput = {
        name: '티셔츠',
        imageUrl: 'http://test.com/1.png',
      };

      jest
        .spyOn(service, 'createCategory')
        .mockImplementation(() => Promise.resolve({ ok: true }));

      const result = await controller.createCategory(createCategoryInput);

      expect(result).toEqual({
        ok: true,
      });
    });
  });

  // describe('GET /categories', () => {
  //   it('카테고리들이 조회되어야 한다.', async () => {
  //     const getCategoriesOutput = [
  //       {
  //         id: 1,
  //         name: 'test1',
  //         imageUrl: 'https://test.com/1.png',
  //       },
  //       {
  //         id: 2,
  //         name: 'test2',
  //         imageUrl: 'https://test.com/2.png',
  //       },
  //       {
  //         id: 3,
  //         name: 'test3',
  //         imageUrl: 'https://test.com/3.png',
  //       },
  //     ];

  //     jest
  //       .spyOn(service, 'findAllCategories')
  //       .mockImplementation(() =>
  //         Promise.resolve({ ok: true, results: getCategoriesOutput }),
  //       );
  //     const result = await controller.getCategories();

  //     expect(result).toEqual({
  //       ok: true,
  //       results: getCategoriesOutput,
  //     });
  //   });
  // });
});
