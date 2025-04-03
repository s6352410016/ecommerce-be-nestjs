import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
    IsString,
    IsNotEmpty,
    IsInt,
    IsNumber,
} from 'class-validator';

export class UpdateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    stockQuantity: number;

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    categoryId: number;
}