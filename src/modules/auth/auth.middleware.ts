import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Response, NextFunction } from 'express';
import { RequestWithUser } from 'src/config/common/interfaces/request-with-user.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.split(' ')[1];
    let payload: any;

    try {
      payload = this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.getUserById(payload.userId);
    if (!user || user.subscriptionStatus === 'inactive') {
      throw new UnauthorizedException('Subscription inactive');
    }
    req.user = {
      userId: user.id,
      username: user.email,
    };
    next();
  }
}
