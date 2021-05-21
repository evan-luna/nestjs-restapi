import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Output } from 'src/common/dtos/output.dto';
import { Category } from '../category.entity';

export class CreateCategoryInput extends PickType(Category, ['name']) {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly imageUrl: string;
}

export class CreateCategoryOutput extends Output {}
