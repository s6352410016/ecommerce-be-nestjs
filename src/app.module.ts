import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { Product } from './product/entities/product.entity';
import { Category } from './category/entity/category.entity';
import { ProductImage } from './product/entities/product-images.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, 
      entities: [
        User,
        Product,
        ProductImage,
        Category
      ],
      synchronize: process.env.NODE_ENV !== "production",
      logging: false
    }),
    UsersModule,
    AuthModule,
    ProductModule,
    CategoryModule,
  ],
})
export class AppModule {}
