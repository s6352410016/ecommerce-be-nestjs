import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interface/jwt-payload';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const token = req?.cookies?.token;
          if (token) {
            const { accessToken } = JSON.parse(token);
            return accessToken;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.AT_SECRET as string,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
