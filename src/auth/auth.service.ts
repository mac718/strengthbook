import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from '../users/dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByPassword(loginAttempt: SigninUserDto) {
    const user = await this.usersService.findOneByEmail(loginAttempt.email);

    return new Promise(resolve => {
      user.checkPassword(loginAttempt.password, (err, isMatch) => {
        if (err) throw new UnauthorizedException();

        if (isMatch) {
          // If there is a successful match, generate a JWT for the user
          resolve(this.createJwtPayload(user));
        } else {
          throw new UnauthorizedException();
        }
      });
    });
  }

  async validateUserByJwt(payload: JwtPayload) {
    let user = await this.usersService.findOneByEmail(payload.email);

    if (user) {
      return this.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  createJwtPayload(user) {
    const data: JwtPayload = {
      email: user.email,
    };

    let jwt = this.jwtService.sign(data);

    return {
      expiresIn: 3600,
      token: jwt,
      user: user,
    };
  }
}
