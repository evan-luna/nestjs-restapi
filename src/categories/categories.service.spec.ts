import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoriesRepository: MockRepository<Category>;
  let productsRepository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: mockRepository() },
        { provide: getRepositoryToken(Product), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get(getRepositoryToken(Category));
    productsRepository = module.get(getRepositoryToken(Product));
  });

  describe('createCategory', () => {
    const createCategoryArgs = {
      name: 'testCategory',
      imageUrl: 'http://test.com/category.png',
    };

    it('should fail if category exists', async () => {
      categoriesRepository.findOne.mockResolvedValue({
        name: 'testCategory1',
        imageUrl: 'http://test.com/category1.png',
      });

      const result = await service.createCategory(createCategoryArgs);

      expect(categoriesRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoriesRepository.findOne).toHaveBeenCalledWith(
        createCategoryArgs,
      );

      expect(result).toEqual({
        ok: false,
        error: 'The category is already exist',
      });
    });

    it('should create a new category', async () => {
      categoriesRepository.findOne.mockResolvedValue(undefined);
      categoriesRepository.save.mockResolvedValue(createCategoryArgs);

      const result = await service.createCategory(createCategoryArgs);

      expect(categoriesRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoriesRepository.findOne).toHaveBeenCalledWith(
        createCategoryArgs,
      );
      expect(categoriesRepository.save).toHaveBeenCalledTimes(1);
      expect(categoriesRepository.save).toHaveBeenCalledWith(
        createCategoryArgs,
      );

      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      categoriesRepository.findOne.mockRejectedValue(new Error());

      const result = await service.createCategory(createCategoryArgs);

      expect(categoriesRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoriesRepository.findOne).toHaveBeenCalledWith(
        createCategoryArgs,
      );

      expect(result).toEqual({
        ok: false,
        error: 'Could not create category',
      });
    });
  });

  describe('findAllCategories', () => {
    const findCategories = [
      {
        id: 1,
        name: 'test1',
        imageUrl: 'http://test.com/test1.png',
      },
      {
        id: 2,
        name: 'test2',
        imageUrl: 'http://test.com/test2.png',
      },
      {
        id: 3,
        name: 'test3',
        imageUrl: 'http://test.com/test3.png',
      },
    ];

    it('should fail if categories not found', async () => {
      categoriesRepository.find.mockResolvedValue(undefined);

      const result = await service.findAllCategories();

      expect(result).toEqual({
        ok: false,
        error: 'Categories not found',
      });
    });

    it('should find all categories', async () => {
      categoriesRepository.find.mockResolvedValue(findCategories);

      const result = await service.findAllCategories();

      expect(result).toEqual({
        ok: true,
        results: findCategories,
      });
    });

    it('should fail on exception', async () => {
      categoriesRepository.find.mockRejectedValue(new Error());

      const result = await service.findAllCategories();

      expect(result).toEqual({
        ok: false,
        error: 'Could not load categories',
      });
    });
  });

  describe('findCategory', () => {
    const findCategoryArgs = {
      categoryId: 1,
      category: {
        id: 1,
        name: 'testCategory',
        imageUrl: 'http://test.com/testCategory.png',
      },
    };

    it('should if category not found', async () => {
      categoriesRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findCategory(findCategoryArgs.categoryId);

      expect(result).toEqual({ ok: false, error: 'Category not found' });
    });

    it('should find category', async () => {
      categoriesRepository.findOne.mockResolvedValue(findCategoryArgs.category);

      const result = await service.findCategory(findCategoryArgs.categoryId);

      expect(categoriesRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoriesRepository.findOne).toHaveBeenCalledWith(
        findCategoryArgs.categoryId,
      );

      expect(result).toEqual({ ok: true, result: findCategoryArgs.category });
    });

    it('should fail on exception', async () => {
      categoriesRepository.findOne.mockRejectedValue(new Error());

      const result = await service.findCategory(findCategoryArgs.categoryId);

      expect(result).toEqual({ ok: false, error: 'Could not load category' });
    });
  });

  describe('deleteCategory', () => {
    const deleteCategoryArgs = {
      categoryId: 1,
      category: {
        id: 1,
        name: 'testCategory',
        imageUrl: 'http://test.com/testCategory.png',
      },
    };

    it('should fail if category not found', async () => {
      categoriesRepository.findOne.mockResolvedValue(undefined);

      const result = await service.deleteCategory(
        deleteCategoryArgs.categoryId,
      );

      expect(result).toEqual({ ok: false, error: 'Category not found' });
    });

    it('should delete category', async () => {
      categoriesRepository.findOne.mockResolvedValue(
        deleteCategoryArgs.category,
      );

      const result = await service.deleteCategory(
        deleteCategoryArgs.categoryId,
      );

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      categoriesRepository.findOne.mockRejectedValue(new Error());

      const result = await service.deleteCategory(
        deleteCategoryArgs.categoryId,
      );

      expect(result).toEqual({ ok: false, error: 'Could not delete category' });
    });
  });

  describe('updateCategory', () => {
    const updateCategoryArgs = {
      categoryId: 1,
      category: {
        id: 1,
        name: 'testCategory',
        imageUrl: 'http://test.com/testCategory.png',
      },
    };

    it('should fail if category not found', async () => {
      categoriesRepository.findOne.mockResolvedValue(undefined);

      const result = await service.updateCategory(
        updateCategoryArgs.categoryId,
        updateCategoryArgs.category,
      );

      expect(result).toEqual({ ok: false, error: 'Category not found' });
    });

    it('should update category', async () => {
      categoriesRepository.findOne.mockResolvedValue(
        updateCategoryArgs.category,
      );

      const result = await service.updateCategory(
        updateCategoryArgs.categoryId,
        updateCategoryArgs.category,
      );

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      categoriesRepository.findOne.mockRejectedValue(new Error());

      const result = await service.updateCategory(
        updateCategoryArgs.categoryId,
        updateCategoryArgs.category,
      );

      expect(result).toEqual({ ok: false, error: 'Could not update category' });
    });
  });

  // describe('findProductsOfCategory', () => {
  //   const findProductsOfCategoryArgs = {
  //     categoryId: 1,
  //     page: 1,
  //     take: 3,
  //   };
  //   it('should fail if category not found', async () => {
  //     categoriesRepository.findOne.mockResolvedValue(undefined);

  //     const result = await service.findProductsOfCategory({
  //       findProductsOfCategoryArgs.categoryId,
  //       findProductsOfCategoryArgs.page,
  //       findProductsOfCategoryArgs.take,
  //     });
  //   });
  // });
});
