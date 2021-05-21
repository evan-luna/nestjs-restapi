import { Output } from 'src/common/dtos/output.dto';
import { Category } from '../category.entity';

export class CategoryOutput extends Output {
  result?: Category;
}
