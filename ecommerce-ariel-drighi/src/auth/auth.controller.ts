import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LowercaseEmailInterceptor } from 'src/interceptorss/lowercase-email.interceptor';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  findAll() {
    return 'auth controller';
  }
  @Post('signup')
  @UseInterceptors(LowercaseEmailInterceptor)
  async signUp(@Body() userData: CreateUserDto): Promise<{ id: string }> {
    const { password, confirmPassword, email, ...rest } = userData;

    if (password !== confirmPassword) {
      throw new HttpException(
        'Las contraseñas no coinciden',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.usersService.findByEmailForSignUp(email);
    if (existingUser) {
      throw new HttpException(
        'El correo electrónico ya está en uso',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      ...rest,
      email,
      password: hashedPassword,
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  @Post('signin')
  async signin(@Body() body: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = body;
    if (!email || !password) {
      throw new UnauthorizedException('Email y password son requeridos');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email o password incorrectos');
    }
    const payload = {
      email: user.email,
      sub: user.id,
      administrator: user.administrator,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { accessToken };
  }
}
