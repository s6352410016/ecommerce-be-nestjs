import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { GitHubSignInDto } from './dto/github-signin.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(
    signUpDto: SignUpDto,
  ): Promise<Omit<User, "passwordHash"> | null> {
    const { name, email, password, phone, address } = signUpDto;
    const userExist = await this.usersRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });

    if (!userExist) {
      const passwordHash = await bcrypt.hash(password, 12);
      const user = this.usersRepository.create({
        name,
        email,
        passwordHash,
        phone,
        address,
      });
      const saveUser = await this.usersRepository.save(user);
      const { passwordHash: password_hash, ...details } = saveUser;
      return details;
    }

    return null;
  }

  async profile(payload: JwtPayloadDto): Promise<Omit<User, "passwordHash">> {
    const { id, email } = payload;
    return (await this.usersRepository.findOne({
      where: {
        id,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        avatar: true,
        provider: true,
        providerId: true,
        createdAt: true,
      },
    })) as Omit<User, "passwordHash">;
  }

  async googleSignIn(
    googleSignInDto: GoogleSignInDto,
    res: Response,
  ): Promise<Omit<User, "passwordHash">> {
    const { provider, providerId, email, name, avatar } = googleSignInDto;
    const userExist = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (userExist && userExist.provider === "google") {
      //กรณีมีบัญชี google ในระบบอยู่แล้ว
      return userExist;
    } else if (userExist && userExist.provider !== "google") {
      //กรณีมีบัญชี อยู่แล้วแต่ provider ไม่ใช่ google
      res.redirect("http://localhost:3000/auth-verify?status=error");
      throw new BadRequestException("Error cannot signin to your account");
    }

    // กรณีไม่มีบัญชีอยู่ในระบบ
    const user = this.usersRepository.create({
      name,
      email,
      avatar,
      provider,
      providerId,
    });

    return await this.usersRepository.save(user);
  }

  async gitHubSignIn(
    gitHubSignInDto: GitHubSignInDto,
    res: Response,
  ): Promise<Omit<User, "passwordHash">> {
    const { provider, providerId, email, name, avatar } = gitHubSignInDto;
    const userExist = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (userExist && userExist.provider === "github") {
      //กรณีมีบัญชี github ในระบบอยู่แล้ว
      return userExist;
    } else if (userExist && userExist.provider !== "github") {
      //กรณีมีบัญชี อยู่แล้วแต่ provider ไม่ใช่ github
      res.redirect("http://localhost:3000/auth-verify?status=error");
      throw new BadRequestException("Error cannot signin to your account");
    }

    // กรณีไม่มีบัญชีอยู่ในระบบ
    const user = this.usersRepository.create({
      name,
      email,
      avatar,
      provider,
      providerId,
    });

    return await this.usersRepository.save(user);
  }
}
