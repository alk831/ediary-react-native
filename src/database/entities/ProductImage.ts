import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Product } from './Product';
import { GenericEntity } from '../generics/GenericEntity';
import { ProductId } from '../../types';

@Entity('product_images')
@Unique<ProductImage>(['url', 'productId'])
export class ProductImage extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  productId!: ProductId;

  @ManyToOne(
    type => Product,
    product => product.images,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'productId' })
  product?: Product;

}