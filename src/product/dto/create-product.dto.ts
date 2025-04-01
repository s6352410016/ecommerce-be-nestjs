import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
    IsString,
    IsNotEmpty,
    IsDecimal,
    IsInt,
    Matches,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsDecimal()
    @Matches(/^\d{1,8}(\.\d{1,2})?$/, { message: "price must have up to 8 digits before decimal and up to 2 digits after decimal" })
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

    @ApiProperty({
        type: "array",
        items: {
            type: "string",
            format: "binary"
        }
    })
    images: Array<Express.Multer.File>;
}