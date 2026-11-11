import type { Project, User } from '../types';

export const hero: User = {
  id: '2ff818db-244b-4f56-b77e-dbbc945fb09c',
  name: 'Peter Parker',
  email: 'peter@teste.com',
  character: 'Homem-Aranha',
  role: 'hero',
  createdAt: '2026-01-01',
};

export function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'f35a328e-7126-4911-9f21-5c137ad6aa36',
    name: 'Operação Aurora',
    description: 'Missão para restaurar a energia da cidade.',
    status: 'em andamento',
    progress: 60,
    goals: {
      agility: 80,
      delight: 80,
      efficiency: 80,
      excellence: 80,
      transparency: 80,
      ambition: 80,
    },
    responsibleId: hero.id,
    responsible: hero,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    ...overrides,
  };
}
