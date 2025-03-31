import { ApiProperty } from '@nestjs/swagger';
import { 
    IsString,
    IsNotEmpty,
    IsEmail,
} from 'class-validator';

export class SignInDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}