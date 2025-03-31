import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interface/jwt-payload';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const token = req?.cookies?.token;
          if (token) {
            const { refreshToken } = JSON.parse(token);
            return refreshToken;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.RT_SECRET as string,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
