import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entities/product.entity";

export class PaginationDto<T> {
  @ApiProperty({ type: [Product] })
  data: T[];

  @ApiProperty()
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}