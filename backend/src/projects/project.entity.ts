import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum ProjectStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em andamento',
  COMPLETED = 'concluído',
}

export type ProjectGoals = {
  agility: number;
  delight: number;
  efficiency: number;
  excellence: number;
  transparency: number;
  ambition: number;
};

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 140 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PENDING })
  status: ProjectStatus;

  @Column({ type: 'smallint', default: 0 })
  progress: number;

  @Column({ type: 'jsonb' })
  goals: ProjectGoals;

  @Column()
  responsibleId: string;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'responsibleId' })
  responsible: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
