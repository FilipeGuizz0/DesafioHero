import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { User, UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project, ProjectStatus } from './project.entity';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
  };
  let usersService: { findOne: jest.Mock };

  const hero: User = {
    id: '2ff818db-244b-4f56-b77e-dbbc945fb09c',
    name: 'Peter Parker',
    email: 'peter@teste.com',
    password: '',
    character: 'Homem-Aranha',
    role: UserRole.HERO,
    projects: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const dto: CreateProjectDto = {
    name: ' Operação Aurora ',
    description: ' Restaurar a energia de toda a cidade. ',
    status: ProjectStatus.IN_PROGRESS,
    progress: 40,
    goals: {
      agility: 80,
      delight: 80,
      efficiency: 80,
      excellence: 80,
      transparency: 80,
      ambition: 80,
    },
    responsibleId: hero.id,
  };

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((value: object) => value as Project),
      save: jest.fn(),
      remove: jest.fn(),
    };
    usersService = { findOne: jest.fn().mockResolvedValue(hero) };

    const module = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: repository },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get(ProjectsService);
  });

  it('cria um projeto normalizado e vinculado ao responsável', async () => {
    repository.save.mockResolvedValue({ id: 'project-1' });
    repository.findOne.mockResolvedValue({ id: 'project-1' });

    await service.create(dto);

    expect(usersService.findOne).toHaveBeenCalledWith(hero.id);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Operação Aurora',
        description: 'Restaurar a energia de toda a cidade.',
        responsible: hero,
      }),
    );
  });

  it('filtra os projetos por status e responsável', async () => {
    repository.find.mockResolvedValue([]);

    await service.findAll({
      status: ProjectStatus.IN_PROGRESS,
      responsibleId: hero.id,
    });

    expect(repository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: ProjectStatus.IN_PROGRESS,
          responsibleId: hero.id,
        },
      }),
    );
  });

  it('informa quando o projeto não existe', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('inexistente')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('atualiza somente os campos informados e troca o responsável', async () => {
    const project = {
      id: 'project-1',
      name: 'Antigo',
      description: 'Descrição antiga',
      responsibleId: 'old-hero',
      responsible: {} as User,
    } as Project;
    repository.findOne
      .mockResolvedValueOnce(project)
      .mockResolvedValueOnce(project);
    repository.save.mockResolvedValue(project);

    await service.update(project.id, {
      name: ' Novo nome ',
      responsibleId: hero.id,
    });

    expect(project.name).toBe('Novo nome');
    expect(project.description).toBe('Descrição antiga');
    expect(project.responsible).toBe(hero);
    expect(repository.save).toHaveBeenCalledWith(project);
  });

  it('remove um projeto existente', async () => {
    const project = { id: 'project-1' } as Project;
    repository.findOne.mockResolvedValue(project);

    await service.remove(project.id);

    expect(repository.remove).toHaveBeenCalledWith(project);
  });
});
