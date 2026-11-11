import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const config = {
    get: jest.fn().mockReturnValue('test-secret'),
  } as unknown as ConfigService;
  const usersService = {
    findById: jest.fn(),
  } as unknown as UsersService;
  const strategy = new JwtStrategy(config, usersService);

  beforeEach(() => jest.clearAllMocks());

  it('usa o perfil atual armazenado no banco', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({
      id: 'hero-id',
      email: 'hero@teste.com',
      role: UserRole.ADMIN,
    } as never);

    await expect(strategy.validate({ sub: 'hero-id' })).resolves.toEqual({
      id: 'hero-id',
      email: 'hero@teste.com',
      role: UserRole.ADMIN,
    });
  });

  it('invalida a sessão de um usuário removido', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue(null);

    await expect(
      strategy.validate({ sub: 'removed-id' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
