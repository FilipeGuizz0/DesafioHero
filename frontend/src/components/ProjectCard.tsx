import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Project } from '../types';
import { getInitials } from '../utils/projects';

const statusLabels = {
  pendente: 'Pendente',
  'em andamento': 'Em andamento',
  concluído: 'Concluído',
};

interface Props {
  project: Project;
  canManage: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, canManage, onEdit, onDelete }: Props) {
  const initials = getInitials(project.responsible.name);

  return (
    <article className="project-card">
      <div className="project-card__top">
        <span className={`status status--${project.status.replace(' ', '-')}`}>
          <i /> {statusLabels[project.status]}
        </span>
        {canManage ? (
          <div className="card-actions">
            <button
              type="button"
              onClick={() => onEdit(project)}
              aria-label={`Editar ${project.name}`}
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              aria-label={`Excluir ${project.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <MoreHorizontal size={20} className="muted" />
        )}
      </div>

      <h3>{project.name}</h3>
      <p className="project-card__description">{project.description}</p>

      <div className="progress-header">
        <span>Progresso</span>
        <strong>{project.progress}%</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${project.progress}%` }} />
      </div>

      <div className="project-card__footer">
        <div className="responsible">
          <span className="avatar avatar--small">{initials}</span>
          <span>
            <small>Responsável</small>
            {project.responsible.character}
          </span>
        </div>
        <span className="project-date">
          <CalendarDays size={15} />{' '}
          {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </article>
  );
}
