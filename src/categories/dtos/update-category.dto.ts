import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Output } from 'src/common/dtos/output.dto';
import { Category } from '../category.entity';

export class UpdateCategoryInput extends PickType(Category, ['name']) {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly imageUrl: string;
}

export class UpdateCategoryOutput extends Output {}
