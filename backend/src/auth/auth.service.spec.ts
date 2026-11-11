import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    create: jest.Mock;
    findByEmailWithPassword: jest.Mock;
  };
  let jwtService: { signAsync: jest.Mock };

  const user: User = {
    id: '2ff818db-244b-4f56-b77e-dbbc945fb09c',
    name: 'Peter Parker',
    email: 'peter@teste.com',
    character: 'Homem-Aranha',
    role: UserRole.HERO,
    password: '',
    projects: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmailWithPassword: jest.fn(),
    };
    jwtService = { signAsync: jest.fn().mockResolvedValue('jwt-token') };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('registra o herói e cria uma sessão', async () => {
    usersService.create.mockResolvedValue(user);

    const result = await service.register({
      name: user.name,
      email: user.email,
      password: 'Aranha123',
      character: user.character,
    });

    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: expect.not.objectContaining({ password: expect.anything() }),
    });
    expect(result.user).toEqual(
      expect.objectContaining({ id: user.id, email: user.email }),
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id });
  });

  it('autentica credenciais válidas sem expor a senha', async () => {
    const password = await bcrypt.hash('Aranha123', 4);
    usersService.findByEmailWithPassword.mockResolvedValue({
      ...user,
      password,
    });

    const result = await service.login({
      email: user.email,
      password: 'Aranha123',
    });

    expect(result.accessToken).toBe('jwt-token');
    expect(result.user).not.toHaveProperty('password');
  });

  it('rejeita e-mail não cadastrado', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(null);

    await expect(
      service.login({ email: 'naoexiste@teste.com', password: 'Senha123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejeita senha incorreta', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue({
      ...user,
      password: await bcrypt.hash('Correta123', 4),
    });

    await expect(
      service.login({ email: user.email, password: 'Errada123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
