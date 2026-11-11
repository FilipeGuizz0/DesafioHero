import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProjectStatus } from '../project.entity';
import { ProjectGoalsDto } from './project-goals.dto';

export class CreateProjectDto {
  @ApiProperty({ example: 'Operação Escudo Solar' })
  @IsString()
  @MinLength(3)
  @MaxLength(140)
  name: string;

  @ApiProperty({
    example: 'Implantar um escudo energético para proteger a cidade.',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  description: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.IN_PROGRESS })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({ minimum: 0, maximum: 100, example: 45 })
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({ type: ProjectGoalsDto })
  @ValidateNested()
  @Type(() => ProjectGoalsDto)
  goals: ProjectGoalsDto;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  responsibleId: string;
}
