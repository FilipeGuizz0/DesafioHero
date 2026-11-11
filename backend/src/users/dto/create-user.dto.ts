import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Peter Parker' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'peter@heroforce.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Aranha@123' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra e um número',
  })
  password: string;

  @ApiProperty({ example: 'Homem-Aranha' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  character: string;
}
