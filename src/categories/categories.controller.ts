import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AllCategoriesOutput } from './dtos/categories.dto';
import { CategoryProductsOutput } from './dtos/category-products.dto';
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

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategory(
    @Body() categoryData: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return this.categoriesService.createCategory(categoryData);
  }

  @Get()
  getCategories(): Promise<AllCategoriesOutput> {
    return this.categoriesService.findAllCategories();
  }

  @Get(':id')
  getCategory(@Param('id') categoryId: number): Promise<CategoryOutput> {
    return this.categoriesService.findCategory(categoryId);
  }

  @Delete(':id')
  deleteCategory(
    @Param('id') categoryId: number,
  ): Promise<DeleteCategoryOutput> {
    return this.categoriesService.deleteCategory(categoryId);
  }

  @Patch(':id')
  updateCategory(
    @Param('id') categoryId: number,
    @Body() categoryData: UpdateCategoryInput,
  ): Promise<UpdateCategoryOutput> {
    return this.categoriesService.updateCategory(categoryId, categoryData);
  }

  @Get(':id/products')
  getProductsOfCategory(
    @Param('id') categoryId: number,
    @Query()
    query,
  ): Promise<CategoryProductsOutput> {
    return this.categoriesService.findProductsOfCategory({
      categoryId,
      page: query.page,
      take: query.limit,
    });
  }
}
