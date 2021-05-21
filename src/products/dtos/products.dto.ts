import { Type } from 'class-transformer';
import { IsNumber, IsObject, Min } from 'class-validator';
import { Output } from 'src/common/dtos/output.dto';
import { Product } from '../product.entity';

export class AllProductsInput {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly skip: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly take: number;
}

export class AllProductsOutput extends Output {
  @IsObject()
  results?: {
    hasPrev: number;
    hasNext: number;
    totalPage: number;
    products: Product[];
  };
}
