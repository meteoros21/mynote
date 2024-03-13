import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Query, Req, Session, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/user.service';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { UserDto } from './dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtService } from './jwt.service';
const bcrypt = require('bcrypt')

@Controller('user')
export class UserController {
  constructor(private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private configService: ConfigService) {}

  @Get('list')
  async getUsers(): Promise<User[]> {
    console.log(this.configService.get<String>('app.host'))
    return await this.userService.getAllUsers();
  }

  @Get('profile')
  async getUser(@Req() req: any): Promise<User> {
    
    const user: any = this.jwtService.checkToken(req)

    if (!user) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    return await this.userService.getUserByUsername(user.username)
  }

  @Put('profile')
  @UseInterceptors(NoFilesInterceptor())
  async updateUser(@Req() req: any, @Body() user: UserDto, @Session() session: Record<string, any>) : Promise<User> {

    const userInfo = this.jwtService.checkToken(req)

    if (!userInfo) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    if (userInfo.username != user.username) {
      throw new HttpException('Invalid username', HttpStatus.UNAUTHORIZED);
    }
    
    const newUser = await this.userService.updateUser(user)
    newUser.password = ''
    session.user = newUser

    return newUser
  }

  @Post('join')
  @UseInterceptors(NoFilesInterceptor())
  async join(@Body() user: UserDto) {
    return await this.userService.insertUser(user);
  }

  @Post("login")
  @UseInterceptors(NoFilesInterceptor())
  async login(@Body() body: any, @Session() session: Record<string, any>) {
    const user = await this.userService.getUserByUsername(body.username);

    if (!user) {
      throw new HttpException('Invalid username', HttpStatus.UNAUTHORIZED);
    }

    const match = await bcrypt.compare(body.password, user.password)
    if (!match) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    user.password = ''
    session.user = user;

    return {
      token: this.jwtService.genderateToken(JSON.stringify(user))
    }
  }
}
