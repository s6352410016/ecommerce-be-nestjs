import { 
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Post, 
    Request, 
    Response, 
    UseGuards 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { 
    Request as Req, 
    Response as Res 
} from 'express';
import { ReqObjUser } from './interface/req-obj-user.dto';
import { SignUpDto } from './dto/signup.dto';
import { 
    ApiBody, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { User } from 'src/users/entity/user.entity';
import { AtAuthGuard } from './guards/at-auth.guard';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { RtAuthGuard } from './guards/rt-auth.guard';
import { ResSwagger } from './utils/res-swagger';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { GitHubAuthGuard } from './guards/github-auth.guard';
import { GitHubSignInDto } from './dto/github-signin.dto';

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService){}

    @ApiBody({ type: SignInDto })
    @ApiResponse({ 
        type: ResSwagger,
        status: HttpStatus.OK 
    })
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("signin")
    signIn(@Request() req: Req, @Response({ passthrough: true }) res: Res): Promise<ResSwagger> {
        return this.authService.signIn(req.user as ReqObjUser, res);
    }

    @ApiBody({ type: SignUpDto })
    @ApiResponse({ 
        type: User,
        status: HttpStatus.CREATED 
    })
    @Post("signup")
    signUp(@Body() signUpDto: SignUpDto): Promise<Omit<User, "passwordHash">>{
        return this.authService.signUp(signUpDto);
    }

    @ApiResponse({ 
        type: User,
        status: HttpStatus.OK 
    })
    @UseGuards(AtAuthGuard)
    @Get("profile")
    profile(@Request() req: Req): Promise<Omit<User, "passwordHash">>{
        return this.authService.profile(req.user as JwtPayloadDto);  
    }

    @ApiResponse({
        type: ResSwagger,
        status: HttpStatus.OK
    })
    @UseGuards(RtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("refresh")
    refresh(@Request() req: Req, @Response({ passthrough: true }) res: Res): Promise<ResSwagger>{
        return this.authService.refresh(req.user as JwtPayloadDto, res);
    }

    @ApiResponse({
        type: ResSwagger,
        status: HttpStatus.OK
    })
    @UseGuards(AtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("signout")
    signout(@Response({ passthrough: true }) res: Res): ResSwagger{
        return this.authService.signout(res);
    }

    @ApiResponse({ description: "open google signin" })
    @UseGuards(GoogleAuthGuard)
    @Get("google")
    googleSignIn(){}

    @ApiResponse({
        type: ResSwagger,
        status: HttpStatus.OK
    })
    @UseGuards(GoogleAuthGuard)
    @Get("google/callback")
    async googleAuthRedirect(@Request() req: Req, @Response({ passthrough: true }) res: Res){
        return this.authService.googleSignIn(req.user as GoogleSignInDto, res);
    }

    @ApiResponse({ description: "open github signin" })
    @UseGuards(GitHubAuthGuard)
    @Get("github")
    gitHubSignIn(){}

    @ApiResponse({
        type: ResSwagger,
        status: HttpStatus.OK
    })
    @UseGuards(GitHubAuthGuard)
    @Get("github/callback")
    async gitHubAuthRedirect(@Request() req: Req, @Response({ passthrough: true }) res: Res){
        return this.authService.gitHubSignIn(req.user as GitHubSignInDto, res);
    }
}
