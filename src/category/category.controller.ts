import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRes } from './utils/category-res';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("category")
@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService){}

  @ApiResponse({
    type: [CategoryRes],
    status: HttpStatus.OK
  })
  @Get("find")
  find(): Promise<CategoryRes[]>{
    return this.categoryService.find();
  }
}
