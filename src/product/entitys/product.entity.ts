import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/category/entity/category.entity';
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    ManyToOne,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { ProductImage } from './product-images.entity';

@Entity("product")
export class Product {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: "varchar", length: 255 })
    name: string;

    @ApiProperty()
    @Column({ type: "text", nullable: true })
    description: string;

    @ApiProperty()
    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @ApiProperty()
    @Column({ type: "int", default: 0, name: "stock_quantity" })
    stockQuantity: number;

    @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "category_id" })
    category: Category;

    @OneToMany(() => ProductImage, (productImage) => productImage.product)
    images: ProductImage[];

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date;
}