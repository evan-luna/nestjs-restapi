import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Output } from 'src/common/dtos/output.dto';
import { Product } from '../product.entity';

export class CreateProductInput extends PickType(Product, ['name', 'price']) {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly imageUrl: string;

  @IsString()
  readonly detailPageUrl: string;
}

export class CreateProductOutput extends Output {}
