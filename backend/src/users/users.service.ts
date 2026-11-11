import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const email = this.config
      .get<string>('ADMIN_EMAIL', 'admin@heroforce.com')
      .toLowerCase();
    const exists = await this.usersRepository.findOne({ where: { email } });
    if (exists) return;

    await this.createWithRole(
      {
        name: this.config.get<string>('ADMIN_NAME', 'Nick Fury'),
        email,
        password: this.config.get<string>('ADMIN_PASSWORD', 'Admin@123'),
        character: this.config.get<string>('ADMIN_CHARACTER', 'Nick Fury'),
      },
      UserRole.ADMIN,
    );
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.createWithRole(dto, UserRole.HERO);
  }

  private async createWithRole(
    dto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const email = dto.email.trim().toLowerCase();
    const exists = await this.usersRepository.findOne({ where: { email } });
    if (exists) throw new ConflictException('Este e-mail já está em uso');

    const user = this.usersRepository.create({
      ...dto,
      email,
      name: dto.name.trim(),
      character: dto.character.trim(),
      password: await bcrypt.hash(dto.password, 12),
      role,
    });
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Herói não encontrado');
    return user;
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const email = dto.email?.trim().toLowerCase();

    if (email && email !== user.email) {
      const exists = await this.usersRepository.findOne({
        where: { email },
      });
      if (exists) throw new ConflictException('Este e-mail já está em uso');
    }

    if (dto.name !== undefined) user.name = dto.name.trim();
    if (dto.character !== undefined) user.character = dto.character.trim();
    if (email !== undefined) user.email = email;
    if (dto.role !== undefined) user.role = dto.role;

    return this.usersRepository.save(user);
  }

  async remove(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
      throw new BadRequestException('Você não pode excluir o próprio usuário');
    }

    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { projects: true },
    });
    if (!user) throw new NotFoundException('Herói não encontrado');
    if (user.projects.length > 0) {
      throw new BadRequestException(
        'Não é possível excluir um herói responsável por projetos',
      );
    }

    await this.usersRepository.remove(user);
  }
}
