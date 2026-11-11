import { describe, expect, it } from 'vitest';
import { createProject } from '../test/fixtures';
import { calculateProjectStats, filterProjects, getInitials } from './projects';

describe('project utilities', () => {
  const projects = [
    createProject({ id: '1', name: 'Operação Aurora', progress: 40 }),
    createProject({
      id: '2',
      name: 'Escudo Solar',
      status: 'concluído',
      progress: 100,
    }),
  ];

  it('combina busca, status e responsável nos filtros', () => {
    expect(
      filterProjects(projects, {
        search: 'escudo',
        status: 'concluído',
        responsibleId: projects[1].responsibleId,
      }),
    ).toEqual([projects[1]]);
  });

  it('calcula os indicadores sem divisão por zero', () => {
    expect(calculateProjectStats(projects)).toEqual({
      total: 2,
      active: 1,
      completed: 1,
      average: 70,
    });
    expect(calculateProjectStats([]).average).toBe(0);
  });

  it('gera iniciais para nomes simples e compostos', () => {
    expect(getInitials('  Peter   Parker  ')).toBe('PP');
    expect(getInitials('Diana')).toBe('D');
  });
});
