import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class ProjectGoalsDto {
  @ApiProperty({ minimum: 0, maximum: 100, example: 80 })
  @IsInt()
  @Min(0)
  @Max(100)
  agility: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 90 })
  @IsInt()
  @Min(0)
  @Max(100)
  delight: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 75 })
  @IsInt()
  @Min(0)
  @Max(100)
  efficiency: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 95 })
  @IsInt()
  @Min(0)
  @Max(100)
  excellence: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  transparency: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 85 })
  @IsInt()
  @Min(0)
  @Max(100)
  ambition: number;
}
