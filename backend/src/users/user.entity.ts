import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';

export enum UserRole {
  HERO = 'hero',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 160 })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 100 })
  character: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.HERO })
  role: UserRole;

  @OneToMany(() => Project, (project) => project.responsible)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
