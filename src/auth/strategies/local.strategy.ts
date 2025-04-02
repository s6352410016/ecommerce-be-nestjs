
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entity/user.entity';
import { SignInDto } from '../dto/signin.dto';
import { validateOrReject } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(email: string, password: string): Promise<Omit<User, "passwordHash">> {
    const signInDto = new SignInDto();
    signInDto.email = email;
    signInDto.password = password;

    try{
      await validateOrReject(signInDto);
    }catch(error){
      throw new BadRequestException("Error inputs is not valid");
    } 

    const user = await this.authService.validateUser(email, password);
    if(user && user.provider === "local"){
      return user;
    }

    throw new UnauthorizedException();
  }
}
