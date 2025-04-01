import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entitys/product.entity';
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    OneToMany
} from 'typeorm';

@Entity("category")
export class Category {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: "varchar", length: 100, unique: true })
    name: string;

    @ApiProperty()
    @Column({ type: "text", nullable: true })
    description: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date;
}