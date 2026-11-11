import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ProjectStatus } from '../project.entity';

export class ProjectQueryDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsUUID()
  responsibleId?: string;
}
