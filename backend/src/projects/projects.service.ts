import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const responsible = await this.usersService.findOne(dto.responsibleId);
    const project = this.projectsRepository.create({
      ...dto,
      name: dto.name.trim(),
      description: dto.description.trim(),
      responsible,
    });
    const saved = await this.projectsRepository.save(project);
    return this.findOne(saved.id);
  }

  findAll(query: ProjectQueryDto): Promise<Project[]> {
    const where: FindOptionsWhere<Project> = {};
    if (query.status) where.status = query.status;
    if (query.responsibleId) where.responsibleId = query.responsibleId;

    return this.projectsRepository.find({
      where,
      relations: { responsible: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: { responsible: true },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    const responsible = dto.responsibleId
      ? await this.usersService.findOne(dto.responsibleId)
      : undefined;
    if (dto.name !== undefined) project.name = dto.name.trim();
    if (dto.description !== undefined) {
      project.description = dto.description.trim();
    }
    if (dto.status !== undefined) project.status = dto.status;
    if (dto.progress !== undefined) project.progress = dto.progress;
    if (dto.goals !== undefined) project.goals = dto.goals;
    if (dto.responsibleId !== undefined && responsible) {
      project.responsibleId = dto.responsibleId;
      project.responsible = responsible;
    }

    await this.projectsRepository.save(project);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }
}
