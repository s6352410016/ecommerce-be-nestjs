import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { 
    ApiConsumes, 
    ApiParam, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { AtAuthGuard } from 'src/auth/guards/at-auth.guard';

@UseGuards(AtAuthGuard)
@ApiTags("product")
@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiResponse({
    type: Product,
    status: HttpStatus.CREATED,
  })
  @ApiConsumes("multipart/form-data")
  @Post("create")
  @UseInterceptors(FilesInterceptor("images", 10))
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

  @ApiResponse({
    type: [Product],
    status: HttpStatus.OK
  })
  @Get("find")
  find(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ): Promise<Product[]>{
    return this.productService.find(+page, +limit);
  }

  @ApiResponse({
    type: Product,
    status: HttpStatus.OK
  })
  @Get("find/:id")
  findById(@Param("id") id: number): Promise<Product>{
    return this.productService.findById(+id);
  }
}
