import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enum/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(page: number, limit: number): Promise<Partial<User>[]> {
    const users = await this.usersRepository.findAll(page, limit);
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const { confirmPassword, ...user } = userData;

    const existingUser = await this.usersRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    const newUser = { ...user, administrator: Role.User };

    return this.usersRepository.create(newUser);
  }

  async createAdmin(userData: CreateUserDto): Promise<User> {
    const { password, confirmPassword, ...rest } = userData;

    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersRepository.create({
      ...rest,
      password: hashedPassword,
      administrator: Role.Admin,
    });

    return newUser;
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.update(id, user);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOne(id);
    return updatedUser;
  }

  async delete(id: string): Promise<string> {
    const deletedUser = await this.usersRepository.findOne(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersRepository.delete(id);
    return deletedUser.id;
  }

  async findByEmail(email: string): Promise<User> {
    const foundUser = await this.usersRepository.findByEmail(email);
    if (!foundUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return foundUser;
  }

  async findByEmailForSignUp(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }
}
