import { Category } from 'src/categories/category.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  imageUrl: string;

  @Column()
  detailPageUrl: string;

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];
}
