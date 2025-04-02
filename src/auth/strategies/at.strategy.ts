import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

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

  async validate(payload: JwtPayloadDto) {
    return payload;
  }
}
