import { ApiProperty } from '@nestjs/swagger';
import { 
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
    MaxLength
} from 'class-validator';

export class SignUpDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(20)
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;
}