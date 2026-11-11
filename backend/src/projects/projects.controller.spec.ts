import { CanActivate, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ProjectStatus } from './project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let app: INestApplication;
  let projectsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const validProject = {
    name: 'Operação Aurora',
    description: 'Restaurar a energia de toda a cidade.',
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
    responsibleId: '2ff818db-244b-4f56-b77e-dbbc945fb09c',
  };

  beforeAll(async () => {
    projectsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const allowRequest: CanActivate = { canActivate: () => true };

    const module = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        { provide: ProjectsService, useValue: projectsService },
        JwtAuthGuard,
        RolesGuard,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(allowRequest)
      .overrideGuard(RolesGuard)
      .useValue(allowRequest)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => app.close());

  beforeEach(() => jest.clearAllMocks());

  it('cria um projeto válido pela API', async () => {
    projectsService.create.mockResolvedValue({
      id: 'project-id',
      ...validProject,
    });

    await request(app.getHttpServer())
      .post('/projects')
      .send(validProject)
      .expect(201);

    expect(projectsService.create).toHaveBeenCalledWith(validProject);
  });

  it('rejeita percentual fora do intervalo permitido', async () => {
    await request(app.getHttpServer())
      .post('/projects')
      .send({ ...validProject, progress: 150 })
      .expect(400);

    expect(projectsService.create).not.toHaveBeenCalled();
  });

  it('rejeita identificador inválido antes de consultar o serviço', async () => {
    await request(app.getHttpServer()).get('/projects/id-invalido').expect(400);
    expect(projectsService.findOne).not.toHaveBeenCalled();
  });

  it('responde sem conteúdo após excluir', async () => {
    projectsService.remove.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .delete('/projects/f35a328e-7126-4911-9f21-5c137ad6aa36')
      .expect(204);
  });
});
