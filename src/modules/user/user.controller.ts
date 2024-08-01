// src/user/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../config/security/guards/jwt-auth.guard';
import { userDto } from './dto/user.dto';
import { User, UserRole } from './entity/user.entity';
import { UserService } from './user.service';
import { Roles } from 'src/config/decorators/roles.decorator';
import { Response } from 'express';
import { RequestWithUser } from 'src/config/common/interfaces/request-with-user.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiBearerAuth('access-token')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Get('getUsers')
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(User) },
      example: [
        {
          id: 1,
          name: 'Luiz Belispetre',
          email: 'luizbelispetre@gmail.com',
          password: 'asd!@#$%FSAD1253',
          profilePicture: 'https://www.google.com/ProfilePicturePhoto',
          googleId: '104449820953176261238',
          authType: 'google',
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'janedoe@hotmail.com',
          password: 'asd!@#$%FSAD1253',
          profilePicture: 'https://www.google.com/ProfilePicturePhoto',
          googleId: '104449820953176261238',
          authType: 'direct',
        },
        {
          id: 2,
          name: 'Kayllane',
          email: 'kaka@gmail.com',
          password: 'asd!@#$%FSAD1253',
          profilePicture: 'https://www.google.com/ProfilePicturePhoto',
          googleId: '104449820953176261238',
          authType: 'direct',
        },
      ],
    },
  })
  findAllUsers() {
    this.logger.log('Retrieving all users');
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Get('getUserByEmail/:email')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiResponse({ status: 200, description: 'Success', type: [User] })
  @ApiParam({
    name: 'email',
    required: true,
    description: 'Email of the user to retrieve',
  })
  getUserByEmail(@Param('email') email: string): Promise<User> {
    this.logger.log(`Retrieving user by email: ${email}`);
    return this.userService.getUserByEmail(email);
  }

  @Post('createUser')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Success', type: [User] })
  @ApiBody({ description: 'User Data', type: [userDto] })
  async createUser(@Body() userData: userDto): Promise<User> {
    this.logger.log(`Creating user with email: ${userData.email}`);
    const result = await this.userService.createUser(userData);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Put('updateUser/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Success', type: [User] })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to update',
  })
  @ApiBody({ description: 'User Data', type: [userDto] })
  updateUser(
    @Param('id') userId: number,
    @Body() userData: userDto,
  ): Promise<User> {
    this.logger.log(`Updating user with ID: ${userId}`);
    return this.userService.updateUser(userId, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateUserSelf')
  @ApiOperation({ summary: 'Update own account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiBody({ description: 'User Data', type: userDto })
  async updateUserSelf(@Req() req: RequestWithUser, @Body() userData: userDto) {
    const userId = req.user.userId;
    this.logger.log(`Self-updating user with ID: ${userId}`);
    return this.userService.updateUserSelf(userId, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Delete('deleteUser/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to delete',
  })
  async deleteUser(@Param('id') userId: number): Promise<void> {
    this.logger.log(`Deleting user with ID: ${userId}`);
    await this.userService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteSelf')
  @ApiOperation({ summary: 'Delete own account' })
  @ApiResponse({ status: 204, description: 'Account deleted' })
  async deleteSelf(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    const userId = req.user.userId;
    this.logger.log(`Self-deleting user with ID: ${userId}`);
    await this.userService.deleteUserSelf(userId);
    res.status(204).send();
  }
}
