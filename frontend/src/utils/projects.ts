import type { Project, ProjectStatus } from '../types';

export interface ProjectFilters {
  search: string;
  status: ProjectStatus | '';
  responsibleId: string;
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const search = filters.search.trim().toLocaleLowerCase('pt-BR');

  return projects.filter((project) => {
    const searchableText = `${project.name} ${project.description}`.toLocaleLowerCase(
      'pt-BR',
    );
    const matchesSearch = !search || searchableText.includes(search);
    const matchesStatus = !filters.status || project.status === filters.status;
    const matchesHero =
      !filters.responsibleId || project.responsibleId === filters.responsibleId;

    return matchesSearch && matchesStatus && matchesHero;
  });
}

export function calculateProjectStats(projects: Project[]) {
  const totalProgress = projects.reduce((sum, project) => sum + project.progress, 0);

  return {
    total: projects.length,
    active: projects.filter((project) => project.status === 'em andamento').length,
    completed: projects.filter((project) => project.status === 'concluído').length,
    average: projects.length ? Math.round(totalProgress / projects.length) : 0,
  };
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('pt-BR'))
    .join('');
}
