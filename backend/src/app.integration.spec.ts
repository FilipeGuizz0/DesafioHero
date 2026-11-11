import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataType, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { AuthService } from './auth/auth.service';
import { Project, ProjectStatus } from './projects/project.entity';
import { ProjectsService } from './projects/projects.service';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';

describe('HeroForce integration', () => {
  let dataSource: DataSource;
  let authService: AuthService;
  let projectsService: ProjectsService;
  let usersService: UsersService;

  beforeAll(async () => {
    const database = newDb({ autoCreateForeignKeyIndices: true });
    database.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'heroforce_test',
    });
    database.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 16',
    });
    database.registerExtension('uuid-ossp', (schema) => {
      schema.registerFunction({
        name: 'uuid_generate_v4',
        returns: DataType.uuid,
        implementation: randomUUID,
        impure: true,
      });
    });

    dataSource = database.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [User, Project],
      synchronize: true,
    });
    await dataSource.initialize();

    usersService = new UsersService(
      dataSource.getRepository(User),
      new ConfigService(),
    );
    projectsService = new ProjectsService(
      dataSource.getRepository(Project),
      usersService,
    );
    authService = new AuthService(
      usersService,
      new JwtService({ secret: 'integration-test-secret' }),
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('executa cadastro, login e ciclo completo de um projeto', async () => {
    const session = await authService.register({
      name: 'Diana Prince',
      email: 'DIANA@HEROFORCE.COM',
      password: 'Amazonas123',
      character: 'Mulher-Maravilha',
    });

    expect(session.accessToken).toEqual(expect.any(String));
    expect(session.user.email).toBe('diana@heroforce.com');

    await expect(
      authService.login({
        email: 'diana@heroforce.com',
        password: 'Amazonas123',
      }),
    ).resolves.toEqual(
      expect.objectContaining({ accessToken: expect.any(String) }),
    );

    const project = await projectsService.create({
      name: ' Operação Themyscira ',
      description: ' Proteger a cidade e recuperar o artefato perdido. ',
      status: ProjectStatus.PENDING,
      progress: 10,
      goals: {
        agility: 80,
        delight: 90,
        efficiency: 75,
        excellence: 95,
        transparency: 100,
        ambition: 90,
      },
      responsibleId: session.user.id,
    });

    expect(project.name).toBe('Operação Themyscira');
    expect(project.responsible.character).toBe('Mulher-Maravilha');

    const filtered = await projectsService.findAll({
      status: ProjectStatus.PENDING,
      responsibleId: session.user.id,
    });
    expect(filtered).toHaveLength(1);

    const updated = await projectsService.update(project.id, {
      status: ProjectStatus.COMPLETED,
      progress: 100,
    });
    expect(updated.status).toBe(ProjectStatus.COMPLETED);
    expect(updated.progress).toBe(100);

    await projectsService.remove(project.id);
    await expect(projectsService.findOne(project.id)).rejects.toThrow(
      'Projeto não encontrado',
    );
  });
});
