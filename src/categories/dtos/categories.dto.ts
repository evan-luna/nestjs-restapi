import { ValidateNested } from 'class-validator';
import { Output } from 'src/common/dtos/output.dto';
import { Category } from '../category.entity';

export class AllCategoriesOutput extends Output {
  @ValidateNested()
  results?: Category[];
}
