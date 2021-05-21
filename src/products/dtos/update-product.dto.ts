import { PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Output } from 'src/common/dtos/output.dto';
import { Product } from '../product.entity';

export class UpdateProductInput extends PickType(Product, [
  'name',
  'price',
  'imageUrl',
  'detailPageUrl',
]) {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsNumber()
  @IsOptional()
  readonly price: number;

  @IsString()
  @IsOptional()
  readonly imageUrl: string;

  @IsString()
  @IsOptional()
  readonly detailPageUrl: string;
}

export class UpdateProductOutput extends Output {}
