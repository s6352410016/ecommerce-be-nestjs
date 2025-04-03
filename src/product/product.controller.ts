import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Product } from "./entities/product.entity";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dto/create-product.dto";
import { AtAuthGuard } from "src/auth/guards/at-auth.guard";
import { ProductResSwagger } from "./utils/product-res-swagger";
import { ProductImage } from "./entities/product-images.entity";
import { CommonResSwagger } from "./utils/common-res-swagger";
import { UpdateProductDto } from "./dto/update-product.dto";

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
    type: [ProductResSwagger],
    status: HttpStatus.OK,
  })
  @Get("find")
  find(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ): Promise<Product[]> {
    return this.productService.find(+page, +limit);
  }

  @ApiResponse({
    type: Product,
    status: HttpStatus.OK,
  })
  @Get("find/:id")
  findById(@Param("id") id: number): Promise<Product> {
    return this.productService.findById(+id);
  }

  @ApiResponse({
    type: [ProductResSwagger],
    status: HttpStatus.OK,
  })
  @Get("findByName")
  findByName(@Query("productName") name: string): Promise<Product[]> {
    return this.productService.findByName(name);
  }

  @ApiResponse({
    type: Product,
    status: HttpStatus.OK
  })
  @Put("update/:id")
  update(
    @Param("id") id: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product>{
    return this.productService.update(+id, updateProductDto);
  }

  @ApiResponse({
    type: CommonResSwagger,
    status: HttpStatus.OK
  })
  @Delete("delete/:id")
  delete(@Param("id") id: number): Promise<CommonResSwagger>{
    return this.productService.delete(+id);
  }

  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    type: ProductImage,
    status: HttpStatus.OK,
  })
  @Put("image/update/:id")
  @UseInterceptors(FileInterceptor("image"))
  imageUpdate(
    @Param("id") id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ProductImage> {
    return this.productService.updateImage(+id, file);
  }

  @ApiResponse({
    type: CommonResSwagger,
    status: HttpStatus.OK
  })
  @Delete("image/delete/:id")
  imageDelete(@Param("id") id: number): Promise<CommonResSwagger>{
    return this.productService.deleteImage(id);
  }
}
