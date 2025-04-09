import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { Request } from 'express';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies?.accessToken;
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.AT_SECRET as string,
    });
  }

  async validate(payload: JwtPayloadDto) {
    return payload;
  }
}
