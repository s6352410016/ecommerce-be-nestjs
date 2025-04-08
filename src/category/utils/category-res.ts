import { ApiProperty } from "@nestjs/swagger";

export class CategoryRes {
    @ApiProperty()
    label: string;
    @ApiProperty()
    value: string;
}