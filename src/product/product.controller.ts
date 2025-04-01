import {
  Body,
  Controller,
  FileTypeValidator,
  HttpStatus,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { 
    ApiConsumes, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger';
import { Product } from './entitys/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiResponse({
    type: Product,
    status: HttpStatus.CREATED,
  })
  @ApiConsumes('multipart/form-data')
  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 10))
  create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg|webp)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(createProductDto, files);
  }
}
