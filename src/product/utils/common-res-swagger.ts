import { ApiProperty } from "@nestjs/swagger";

export class CommonResSwagger {
    @ApiProperty()
    message: string;
}