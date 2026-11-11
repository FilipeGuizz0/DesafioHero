import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: {
    findOne: jest.Mock;
    find: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

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

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((value: object) => value as User),
      save: jest.fn((value: User) => value),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('normaliza o cadastro e armazena a senha criptografada', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.create({
      name: ' Peter Parker ',
      email: 'PETER@TESTE.COM ',
      password: 'Aranha123',
      character: ' Homem-Aranha ',
    });

    expect(result.name).toBe('Peter Parker');
    expect(result.email).toBe('peter@teste.com');
    expect(result.character).toBe('Homem-Aranha');
    expect(result.role).toBe(UserRole.HERO);
    expect(await bcrypt.compare('Aranha123', result.password)).toBe(true);
  });

  it('impede o cadastro de e-mail duplicado', async () => {
    repository.findOne.mockResolvedValue(hero);

    await expect(
      service.create({
        name: hero.name,
        email: hero.email,
        password: 'Aranha123',
        character: hero.character,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('mantém os campos não enviados durante uma atualização parcial', async () => {
    repository.findOne.mockResolvedValue({ ...hero });

    const result = await service.update(hero.id, { name: ' Peter B. Parker ' });

    expect(result.name).toBe('Peter B. Parker');
    expect(result.email).toBe(hero.email);
    expect(result.character).toBe(hero.character);
  });

  it('informa quando o herói não existe', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(hero.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('impede que o administrador exclua o próprio usuário', async () => {
    await expect(service.remove(hero.id, hero.id)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it('impede excluir um responsável por projetos', async () => {
    repository.findOne.mockResolvedValue({
      ...hero,
      projects: [{ id: 'project-1' }],
    });

    await expect(service.remove(hero.id, 'admin-id')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it('remove um herói sem projetos', async () => {
    repository.findOne.mockResolvedValue({ ...hero, projects: [] });

    await service.remove(hero.id, 'admin-id');

    expect(repository.remove).toHaveBeenCalledWith(
      expect.objectContaining({ id: hero.id }),
    );
  });
});
