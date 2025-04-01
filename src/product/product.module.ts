import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entitys/product.entity';
import { ProductImage } from './entitys/product-images.entity';
import { Category } from 'src/category/entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Category
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
