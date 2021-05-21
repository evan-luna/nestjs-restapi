import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateProductInput,
  CreateProductOutput,
} from './dtos/create-product.dto';
import { DeleteProductOutput } from './dtos/delete-product.dto';
import { AllProductsInput, AllProductsOutput } from './dtos/products.dto';
import { ProductOutput } from './dtos/product.dto';
import { Product } from './product.entity';
import {
  UpdateProductInput,
  UpdateProductOutput,
} from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async createProduct({
    name,
    price,
    imageUrl,
    detailPageUrl,
  }: CreateProductInput): Promise<CreateProductOutput> {
    try {
      const productExists = await this.products.findOne({ name });
      if (productExists) {
        return { ok: false, error: 'The product is already exist' };
      }
      await this.products.save({ name, price, imageUrl, detailPageUrl });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not create product' };
    }
  }

  async findAllProducts({
    skip,
    take,
  }: AllProductsInput): Promise<AllProductsOutput> {
    try {
      const products = await this.products.find({
        skip: (skip - 1) * take,
        take: take,
      });

      if (!products) {
        return { ok: false, error: 'Products not found' };
      }

      const productsCount = await this.products.count();
      const totalPage = Math.ceil(productsCount / take);

      return {
        ok: true,
        results: {
          hasPrev: skip - 1 !== 0 ? skip - 1 : null,
          hasNext: totalPage >= skip + 1 ? skip + 1 : null,
          totalPage: totalPage,
          products,
        },
      };
    } catch (error) {
      return { ok: false, error: 'Could not load products' };
    }
  }

  async findProduct(productId: number): Promise<ProductOutput> {
    try {
      const product = await this.products.findOne(productId);
      if (!product) {
        return { ok: false, error: 'Product not found' };
      }
      return { ok: true, result: product };
    } catch (error) {
      return { ok: false, error: 'Could not load product' };
    }
  }

  async deleteProduct(productId: number): Promise<DeleteProductOutput> {
    try {
      const product = await this.products.findOne(productId);
      if (!product) {
        return { ok: false, error: 'Product not found' };
      }
      await this.products.delete(product);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not delete product' };
    }
  }

  async updateProduct(
    productId: number,
    { name, price, imageUrl, detailPageUrl }: UpdateProductInput,
  ): Promise<UpdateProductOutput> {
    try {
      const product = await this.products.findOne(productId);
      if (!product) {
        return { ok: false, error: 'Product not found' };
      }
      product.name = name;
      product.price = price;
      product.imageUrl = imageUrl;
      product.detailPageUrl = detailPageUrl;
      await this.products.save(product);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not update product' };
    }
  }
}
