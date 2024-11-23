import {
  Param,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminGuard } from '../auth/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enum/role.enum';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ): Promise<Partial<User>[]> {
    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.max(1, parseInt(limit, 10));
    return this.usersService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Partial<User>> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() userData: CreateUserDto): Promise<{ id: string }> {
    try {
      const newUser = await this.usersService.create(userData);
      return { id: newUser.id };
    } catch (e) {
      throw new BadRequestException('Error creating user');
    }
  }

  @Post('create-admin')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() userData: CreateUserDto): Promise<{ id: string }> {
    const newUser = await this.usersService.createAdmin(userData);
    return { id: newUser.id };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() user: UpdateUserDto,
  ): Promise<{ id: string }> {
    const updatedUser = await this.usersService.update(id, user);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { id: updatedUser.id };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ id: string }> {
    const deletedUserId = await this.usersService.delete(id);
    if (!deletedUserId) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { id: deletedUserId };
  }
}
