import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-images.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
    private s3 = new S3Client({
        region: process.env.AWS_BUCKET_REGION as string,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string, 
        },
    });

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(ProductImage)
        private productImageRepository: Repository<ProductImage>,

        private configService: ConfigService,

        private categoryService: CategoryService,
    ){}

    async create(createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<Product>{
        const { name, description, price, stockQuantity, categoryId } = createProductDto;

        const category = await this.categoryService.findById(categoryId);

        if(!category){
            throw new BadRequestException("Error invalid categoryId");
        }

        const product = this.productRepository.create({
            name,
            description,
            price,
            stockQuantity,
            category
        });
        const productSave = await this.productRepository.save(product);

        const productImageSave = files.map(async (file) => {
            const fileExt = file.mimetype.split("/").pop();
            const newFileName = `${uuidv4()}.${fileExt}`;

            const productImage = this.productImageRepository.create({ 
                imageUrl: newFileName,
                product: productSave,
            });
            await this.productImageRepository.save(productImage);

            const putObjCmd = new PutObjectCommand({
                Bucket: this.configService.get<string>("AWS_BUCKET_NAME"),
                Key: `product/${newFileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await this.s3.send(putObjCmd);
        });

        await Promise.all(productImageSave);

        const productWithImages = await this.productRepository.findOne({
            where: {
                id: productSave.id
            },
            relations: {
                images: true,
                category: true
            },
            order: {
                images: {
                    id: "ASC"
                }
            }
        });

        return productWithImages as Product;
    }

    async find(page: number = 1, limit: number = 10): Promise<Product[]>{
        const products = await this.productRepository.find({
            relations: {
                images: true,
                category: true
            },
            order: {
                createdAt: "DESC",
                images: {
                    id: "ASC"
                }
            },
        });
        
        return products.slice((page - 1) * limit, page * limit);
    }

    async findById(id: number): Promise<Product>{
        const product = await this.productRepository.findOne({
            where: {
                id
            },
            relations: {
                images: true,
                category: true
            },
            order: {
                images: {
                    id: "ASC"
                }
            }
        });

        if(!product){
            throw new NotFoundException("Product not found");
        }

        return product;
    }

    
}
