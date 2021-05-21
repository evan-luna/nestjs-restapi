import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get(getRepositoryToken(Product));
  });

  describe('createProduct', () => {
    const createProductArgs = {
      name: '티셔츠',
      price: 12000,
      imageUrl: 'https://www.test.com/111.jpg',
      detailPageUrl: 'https://www.test.com/111',
    };

    it('should fail if product exists', async () => {
      productsRepository.findOne.mockResolvedValue({
        name: '티셔츠',
        price: 1,
        imageUrl: 'https://test.com/1.png',
        detailPageUrl: 'https://test.com/1',
      });

      const reuslt = await service.createProduct(createProductArgs);

      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        name: '티셔츠',
      });

      expect(reuslt).toMatchObject({
        ok: false,
        error: 'The product is already exist',
      });
    });

    it('should create a new product', async () => {
      productsRepository.findOne.mockResolvedValue(undefined);
      productsRepository.save.mockResolvedValue(createProductArgs);

      const result = await service.createProduct(createProductArgs);

      expect(productsRepository.save).toHaveBeenCalledTimes(1);
      expect(productsRepository.save).toHaveBeenCalledWith(createProductArgs);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      productsRepository.findOne.mockRejectedValue(new Error());

      const result = await service.createProduct(createProductArgs);

      expect(result).toMatchObject({
        ok: false,
        error: 'Could not create product',
      });
    });
  });

  describe('findAllProducts', () => {
    const products = [
      {
        id: 1,
        name: 'test1',
        price: 1,
        imageUrl: 'https://test.com/1.png',
        detailPageUrl: 'https://test.com/1',
      },
      {
        id: 2,
        name: 'test2',
        price: 2,
        imageUrl: 'https://test.com/2.png',
        detailPageUrl: 'https://test.com/2',
      },
      {
        id: 3,
        name: 'test3',
        price: 3,
        imageUrl: 'https://test.com/3.png',
        detailPageUrl: 'https://test.com/3',
      },
      {
        id: 4,
        name: 'test4',
        price: 4,
        imageUrl: 'https://test.com/4.png',
        detailPageUrl: 'https://test.com/4',
      },
      {
        id: 5,
        name: 'test5',
        price: 5,
        imageUrl: 'https://test.com/5.png',
        detailPageUrl: 'https://test.com/5',
      },
      {
        id: 6,
        name: 'test6',
        price: 6,
        imageUrl: 'https://test.com/6.png',
        detailPageUrl: 'https://test.com/6',
      },
    ];

    const findAllProductsArgs = {
      skip: 1,
      take: 3,
    };

    it('should find all products', async () => {
      productsRepository.find.mockResolvedValue(products);
      productsRepository.count.mockResolvedValue(6);

      const result = await service.findAllProducts(findAllProductsArgs);

      expect(productsRepository.find).toHaveBeenCalledTimes(1);
      expect(productsRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 3,
      });
      expect(productsRepository.count).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        ok: true,
        results: {
          hasPrev: null,
          hasNext: 2,
          totalPage: 2,
          products,
        },
      });
    });

    it('should fail if products not found', async () => {
      productsRepository.find.mockResolvedValue(undefined);

      const result = await service.findAllProducts(findAllProductsArgs);

      expect(result).toEqual({ ok: false, error: 'Products not found' });
    });

    it('should fail on exception', async () => {
      productsRepository.find.mockRejectedValue(new Error());

      const result = await service.findAllProducts(findAllProductsArgs);

      expect(result).toEqual({ ok: false, error: 'Could not load products' });
    });

    it('skip이 1 이상인 경우', async () => {
      productsRepository.find.mockResolvedValue(products);
      productsRepository.count.mockResolvedValue(6);

      const result = await service.findAllProducts({ skip: 2, take: 3 });

      expect(productsRepository.find).toHaveBeenCalledTimes(1);
      expect(productsRepository.find).toHaveBeenCalledWith({
        skip: 3,
        take: 3,
      });
      expect(productsRepository.count).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        ok: true,
        results: {
          hasPrev: 1,
          hasNext: null,
          totalPage: 2,
          products,
        },
      });
    });
  });

  describe('findProduct', () => {
    const findProductArgs = {
      productId: 1,
      product: {
        id: 1,
        name: 'test1',
        price: 1,
        imageUrl: 'https://test.com/1.png',
        detailPageUrl: 'https://test.com/1',
      },
    };

    it('should fail if product not found', async () => {
      productsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findProduct(findProductArgs.productId);

      expect(result).toEqual({ ok: false, error: 'Product not found' });
    });

    it('should find product', async () => {
      productsRepository.findOne.mockResolvedValue(findProductArgs.product);

      const result = await service.findProduct(findProductArgs.productId);

      expect(result).toEqual({ ok: true, result: findProductArgs.product });
    });

    it('should fail on exception', async () => {
      productsRepository.findOne.mockRejectedValue(new Error());

      const result = await service.findProduct(findProductArgs.productId);

      expect(result).toEqual({ ok: false, error: 'Could not load product' });
    });
  });

  describe('deleteProduct', () => {
    const productId = 1;
    const product = {
      id: 1,
      name: 'test1',
      price: 1,
      imageUrl: 'https://test.com/1.png',
      detailPageUrl: 'https://test.com/1',
    };

    it('should fail if product not found', async () => {
      productsRepository.findOne.mockResolvedValue(undefined);

      const result = await service.deleteProduct(productId);

      expect(result).toEqual({ ok: false, error: 'Product not found' });
    });

    it('should delete product', async () => {
      productsRepository.findOne.mockResolvedValue(product);
      productsRepository.delete.mockResolvedValue(product);

      const result = await service.deleteProduct(productId);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      productsRepository.findOne.mockRejectedValue(undefined);

      const result = await service.deleteProduct(productId);

      expect(result).toEqual({ ok: false, error: 'Could not delete product' });
    });
  });

  describe('updateProduct', () => {
    const oldProduct = {
      id: 1,
      name: 'old_test1',
      price: 1,
      imageUrl: 'https://test.com/old.png',
      detailPageUrl: 'https://test.com/old',
    };
    const updateProductArgs = {
      productId: 1,
      updateInput: {
        name: 'new_test1',
        price: 1,
        imageUrl: 'https://test.com/new.png',
        detailPageUrl: 'https://test.com/new',
      },
    };

    it('should fail if product not found', async () => {
      productsRepository.findOne(undefined);

      const result = await service.updateProduct(
        updateProductArgs.productId,
        updateProductArgs.updateInput,
      );

      expect(result).toEqual({ ok: false, error: 'Product not found' });
    });

    it('should update product', async () => {
      productsRepository.findOne.mockResolvedValue(oldProduct);

      const result = await service.updateProduct(
        updateProductArgs.productId,
        updateProductArgs.updateInput,
      );

      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith(
        updateProductArgs.productId,
      );

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      productsRepository.findOne.mockRejectedValue(new Error());

      const result = await service.updateProduct(
        updateProductArgs.productId,
        updateProductArgs.updateInput,
      );

      expect(result).toEqual({ ok: false, error: 'Could not update product' });
    });
  });
});
