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
import {
  CreateProductInput,
  CreateProductOutput,
} from './dtos/create-product.dto';
import { DeleteProductOutput } from './dtos/delete-product.dto';
import { AllProductsInput, AllProductsOutput } from './dtos/products.dto';
import { ProductOutput } from './dtos/product.dto';
import { ProductsService } from './products.service';
import {
  UpdateProductInput,
  UpdateProductOutput,
} from './dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(
    @Body() productData: CreateProductInput,
  ): Promise<CreateProductOutput> {
    return this.productsService.createProduct(productData);
  }

  @Get()
  getAllProduct(
    @Query()
    query: AllProductsInput,
  ): Promise<AllProductsOutput> {
    return this.productsService.findAllProducts({
      skip: Number(query.skip),
      take: Number(query.take),
    });
  }

  @Get(':id')
  getOneProduct(@Param('id') productId: number): Promise<ProductOutput> {
    return this.productsService.findProduct(productId);
  }

  @Delete(':id')
  deleteOneProduct(
    @Param('id') productId: number,
  ): Promise<DeleteProductOutput> {
    return this.productsService.deleteProduct(productId);
  }

  @Patch(':id')
  updateOneProduct(
    @Param('id') productId: number,
    @Body() productData: UpdateProductInput,
  ): Promise<UpdateProductOutput> {
    return this.productsService.updateProduct(productId, productData);
  }
}
