import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'The name of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  name: string;

  @ApiProperty({
    type: String,
    description: 'The mail of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
    required: true,
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.',
  })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  confirmPassword?: string;

  @ApiProperty({
    type: String,
    description: 'The address of the user',
    required: true,
  })
  @IsString()
  @Length(3, 80)
  address: string;

  @ApiProperty({
    type: Number,
    description: 'The phone of the user',
    required: true,
  })
  @IsNotEmpty()
  phone: number;

  @ApiProperty({
    type: String,
    description: 'The country of the user',
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  country?: string;

  @ApiProperty({
    type: String,
    description: 'The city of the user',
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  city?: string;
}
