// src/user/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
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

@ApiBearerAuth('access-token')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Get('getUsers')
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'Sucess',
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
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Get('getUserByEmail/:email')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiResponse({ status: 200, description: 'Sucess', type: [User] })
  @ApiParam({
    name: 'email',
    required: true,
    description: 'Email of the user to retrieve',
  })
  getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Post('createUser')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'create an user' })
  @ApiResponse({ status: 201, description: 'Sucess', type: [User] })
  @ApiBody({ description: 'User Data', type: [userDto] })
  async createUser(@Body() userData: userDto): Promise<User> {
    const result = await this.userService.createUser(userData);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Put('updateUser/:id')
  @ApiOperation({ summary: 'update an user' })
  @ApiResponse({ status: 200, description: 'Sucess', type: [User] })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Sucess to update user',
  })
  @ApiBody({ description: 'userId', type: [userDto] })
  updateUser(
    @Param('id') userId: number,
    @Body() userData: userDto,
  ): Promise<User> {
    return this.userService.updateUser(userId, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateUserSelf')
  @ApiOperation({ summary: 'Update own account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiBody({ description: 'User Data', type: userDto })
  async updateUserSelf(@Req() req: RequestWithUser, @Body() userData: userDto) {
    const userId = req.user.userId;
    return this.userService.updateUserSelf(userId, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Delete('deleteUser/:id')
  @ApiOperation({ summary: 'Delete an user' })
  @ApiResponse({ status: 204, description: 'user deleted' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id of the user to delete',
  })
  async deleteUser(@Param('id') userId: number): Promise<void> {
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
    await this.userService.deleteUserSelf(req.user.userId);
    res.status(204).send();
  }
}
