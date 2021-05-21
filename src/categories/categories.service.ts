import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { AllCategoriesOutput } from './dtos/categories.dto';
import {
  CategoryProductsInput,
  CategoryProductsOutput,
} from './dtos/category-products.dto';
import { CategoryOutput } from './dtos/category.dto';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { DeleteCategoryOutput } from './dtos/delete-category.dto';
import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,

    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async createCategory({
    name,
    imageUrl,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    try {
      const categoryExists = await this.categories.findOne({ name, imageUrl });
      if (categoryExists) {
        return { ok: false, error: 'The category is already exist' };
      }
      await this.categories.save({ name, imageUrl });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not create category' };
    }
  }

  async findAllCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      if (!categories) {
        return { ok: false, error: 'Categories not found' };
      }

      return { ok: true, results: categories };
    } catch (error) {
      return { ok: false, error: 'Could not load categories' };
    }
  }

  async findCategory(categoryId: number): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne(categoryId);
      if (!category) {
        return { ok: false, error: 'Category not found' };
      }
      return { ok: true, result: category };
    } catch (error) {
      return { ok: false, error: 'Could not load category' };
    }
  }

  async deleteCategory(categoryId: number): Promise<DeleteCategoryOutput> {
    try {
      const category = await this.categories.findOne(categoryId);
      if (!category) {
        return { ok: false, error: 'Category not found' };
      }
      await this.categories.delete(categoryId);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not delete category' };
    }
  }

  async updateCategory(
    categoryId: number,
    { name, imageUrl }: UpdateCategoryInput,
  ): Promise<UpdateCategoryOutput> {
    try {
      const category = await this.categories.findOne(categoryId);
      if (!category) {
        return { ok: false, error: 'Category not found' };
      }
      category.name = name;
      category.imageUrl = imageUrl;
      await this.categories.save(category);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not update category' };
    }
  }

  // categories/1/products?page=1&limit=6
  async findProductsOfCategory({
    categoryId,
    page,
    take,
  }: CategoryProductsInput): Promise<CategoryProductsOutput> {
    try {
      const category = await this.categories.findOne(categoryId);

      if (!category) {
        return { ok: false, error: 'Category not found' };
      }
      const query = {};
      if (!take && page) return { ok: false, error: 'test' };
      if (page) query['page'] = page;
      if (take) query['take'] = take;
      console.log('page:', page, 'limit:', take);

      // const products = await this.products
      //   .createQueryBuilder('product')
      //   .leftJoinAndSelect('product.categories', 'category')
      //   .where('category.id= :id', { id: categoryId })
      //   .skip((page - 1) * take)
      //   .take(take)
      //   .getMany();
      const input = {
        categoryId,
        page,
        take,
      };
      console.log(input);
      const [products, productsCount] = await this.products.findAndCount({
        join: {
          alias: 'product',
          leftJoinAndSelect: {
            category: 'product.categories',
          },
        },
        where: `category.id= ${categoryId}`,
        skip: (page - 1) * take,
        take: take,
      });

      // const productsCount = await this.products.count({
      //   join: ,
      //   relations: ['category'],
      //   where: { 'category.name': category.name },
      // });

      const totalPage = Math.ceil(productsCount / take);
      if (!products) {
        return { ok: false, error: 'Products not found' };
      }
      return {
        ok: true,
        results: {
          hasPrev: +page - 1 !== 0 ? +page - 1 : null,
          hasNext: totalPage >= +page + 1 ? +page + 1 : null,
          totalPage: totalPage,
          products,
        },
      };
    } catch (error) {
      return { ok: false, error: 'error' };
    }
  }
}
