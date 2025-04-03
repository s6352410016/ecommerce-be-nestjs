import { ApiProperty } from '@nestjs/swagger';

export class ProductResSwagger {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    stockQuantity: number;

    @ApiProperty()
    createdAt: Date;
}