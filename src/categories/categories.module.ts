import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    CategoriesService,
  ],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
