import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  delete: jest.fn(),
});

describe('ProductsController', () => {
  let service: ProductsService;
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockRepository() },
      ],
      controllers: [ProductsController],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    controller = module.get<ProductsController>(ProductsController);
  });
  describe('GET /products', () => {
    it('product 가져오기', async () => {
      const allProductInput = {
        skip: 1,
        take: 3,
      };
      const allProductOutput = {
        hasPrev: 1,
        hasNext: 2,
        totalPage: 3,
        products: [
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
        ],
      };

      // jest.spyOn(service, 'findAllProducts').mockImplementation(() => {
      //   return Promise.resolve({
      //     ok: true,
      //     results: allProductOutput,
      //   });
      // });

      const result = await controller.getAllProduct(allProductInput);

      expect(result).toEqual({
        ok: true,
        results: allProductOutput,
      });
    });
  });
  describe('POST /products', () => {
    it('should return OK ', async () => {
      const inputProduct = {
        name: 'test1',
        price: 1,
        imageUrl: 'https://test.com/1.png',
        detailPageUrl: 'https://test.com/1',
      };

      jest.spyOn(service, 'createProduct').mockImplementation(() => {
        return Promise.resolve({
          ok: true,
        });
      });

      const result = await controller.createProduct(inputProduct);

      expect(result).toEqual({
        ok: true,
      });
    });

    it('should return product exist message', async () => {
      const existProduct = {
        name: 'test1',
        price: 1,
        imageUrl: 'https://test.com/1.png',
        detailPageUrl: 'https://test.com/1',
      };

      jest.spyOn(service, 'createProduct').mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          error: 'The product is already exist',
        });
      });

      const result = await controller.createProduct(existProduct);

      expect(result).toEqual({
        ok: false,
        error: 'The product is already exist',
      });
    });
  });
});
