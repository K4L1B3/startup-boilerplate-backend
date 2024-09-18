import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Response, NextFunction } from 'express';
import { RequestWithUser } from 'src/config/common/interfaces/request-with-user.interface';
import * as winston from 'winston';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @Inject('winston')
    private readonly logger: winston.Logger,
  ) { }

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      this.logger.warn('Token missing in request');
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.split(' ')[1];
    let payload: any;

    try {
      payload = this.jwtService.verify(token);
      this.logger.info('Token verified successfully');
    } catch (e) {
      this.logger.error('Invalid token');
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.getUserById(payload.userId);
    if (!user || user.subscriptionStatus === 'inactive') {
      this.logger.warn('User subscription inactive or user not found');
      throw new UnauthorizedException('Subscription inactive');
    }
    req.user = {
      userId: user.id,
      username: user.email,
    };
    this.logger.info(`User ${user.email} authenticated successfully`);
    next();
  }
}
