import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

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

  async validate(payload: JwtPayloadDto) {
    return payload;
  }
}
