import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRes } from './utils/category-res';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtAuthGuard } from 'src/auth/guards/at-auth.guard';

@UseGuards(AtAuthGuard)
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
