import { ValidateNested } from 'class-validator';
import { Output } from 'src/common/dtos/output.dto';
import { Product } from '../product.entity';

export class ProductOutput extends Output {
  @ValidateNested()
  result?: Product;
}
