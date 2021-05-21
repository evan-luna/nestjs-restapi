import { Output } from 'src/common/dtos/output.dto';
import { Product } from 'src/products/product.entity';

export class CategoryProductsInput {
  categoryId: number;
  page?: number;
  take?: number;
}

export class CategoryProductsOutput extends Output {
  results?: {
    hasPrev: number;
    hasNext: number;
    totalPage: number;
    products: Product[];
  };
}
