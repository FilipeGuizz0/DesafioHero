export type UserRole = 'hero' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  character: string;
  role: UserRole;
  createdAt: string;
}

export type ProjectStatus = 'pendente' | 'em andamento' | 'concluído';

export interface ProjectGoals {
  agility: number;
  delight: number;
  efficiency: number;
  excellence: number;
  transparency: number;
  ambition: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  goals: ProjectGoals;
  responsibleId: string;
  responsible: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ProjectPayload {
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  goals: ProjectGoals;
  responsibleId: string;
}
