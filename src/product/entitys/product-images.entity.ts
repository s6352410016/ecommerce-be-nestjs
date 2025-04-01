import { ApiProperty } from '@nestjs/swagger';
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Product } from './product.entity';

@Entity("product_image")
export class ProductImage {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ApiProperty()
    @Column({ type: "text", name: "image_url" })
    imageUrl: string;

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date;
}