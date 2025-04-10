import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/category/entity/category.entity';
import { ProductImage } from '../entities/product-images.entity';

export class ProductResSwagger {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    stockQuantity: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    images: ProductImage[];

    @ApiProperty()
    category: Category;
}