import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ReqObjUser } from './interface/req-obj-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response as Res } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { JwtPayload } from './interface/jwt-payload';
import { SignJwtPayload } from './interface/sign-jwt-payload';
import { ResSwagger } from './utils/res-swagger';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { GitHubSignInDto } from './dto/github-signin.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async signCookie(accessToken: string, refreshToken: string, res: Res){
        const token = JSON.stringify({
            accessToken,
            refreshToken
        });

        res.cookie("token", token, {
            sameSite: "none",
            httpOnly: true,
            secure: true,
        });
    }

    async signJwt(payload: SignJwtPayload): Promise<string[]>{
        const { id, email } = payload;
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id,
                    email
                },
                {
                    secret: this.configService.get<string>("AT_SECRET"),
                    expiresIn: "30m"
                }
            ),
            this.jwtService.signAsync(
                {
                    id,
                    email
                },
                {
                    secret: this.configService.get<string>("RT_SECRET"),
                    expiresIn: "1h"
                }
            ),
        ]);

        return [accessToken, refreshToken];
    }

    async validateUser(email: string, password: string): Promise<Omit<User, "passwordHash"> | null>{
        const user = await this.userService.findOne(email);
        if(user && await bcrypt.compare(password, user.passwordHash)){
            const { passwordHash, ...result } = user;
            return result;
        }

        return null;
    }

    async signIn(user: ReqObjUser, res: Res): Promise<ResSwagger>{
        const { id, email } = user;
        const [accessToken, refreshToken] = await this.signJwt({ id, email });
        await this.signCookie(accessToken, refreshToken, res);

        return {
            message: "signin success"
        }
    }

    async signUp(signUpDto: SignUpDto): Promise<Omit<User, "passwordHash">>{
        const user = await this.userService.create(signUpDto);
        if(!user){
            throw new BadRequestException("error user already exist");
        }

        return user;
    }

    async profile(payload: JwtPayload): Promise<Omit<User, "passwordHash">>{
        const user = await this.userService.profile(payload);
        return user;
    }

    async refresh(payload: JwtPayload, res: Res): Promise<ResSwagger>{
        const { id, email } = payload; 
        const [accessToken, refreshToken] = await this.signJwt({ id, email });
        await this.signCookie(accessToken, refreshToken, res);

        return {
            message: "refresh token success"
        }
    }

    signout(res: Res): ResSwagger{
        res.clearCookie("token");
        return {
            message: "signout success"
        }
    }

    async googleSignIn(googleSignInDto: GoogleSignInDto, res: Res): Promise<ResSwagger>{
        const user = await this.userService.googleSignIn(googleSignInDto);
        const { id, email: userEmail } = user;
        const [accessToken, refreshToken] = await this.signJwt({ id, email: userEmail });
        await this.signCookie(accessToken, refreshToken, res);

        return {
            message: "signin google success"
        }
    }

    async gitHubSignIn(gitHubSignInDto: GitHubSignInDto, res: Res): Promise<ResSwagger>{
        const user = await this.userService.gitHubSignIn(gitHubSignInDto);
        const { id, email: userEmail } = user;
        const [accessToken, refreshToken] = await this.signJwt({ id, email: userEmail });
        await this.signCookie(accessToken, refreshToken, res);

        return {
            message: "signin github success"
        }
    }
}
