import type { CSSProperties } from 'react';
import { CheckCircle2, Clock3, FolderKanban } from 'lucide-react';
import { calculateProjectStats } from '../utils/projects';
import type { Project } from '../types';

export function DashboardStats({ projects }: { projects: Project[] }) {
  const stats = calculateProjectStats(projects);
  const ringStyle = {
    '--progress': `${stats.average * 3.6}deg`,
  } as CSSProperties;

  return (
    <section className="stats-grid" aria-label="Indicadores dos projetos">
      <article>
        <span className="stat-icon stat-icon--purple">
          <FolderKanban size={20} />
        </span>
        <div>
          <small>Total de projetos</small>
          <strong>{stats.total}</strong>
          <em>missões cadastradas</em>
        </div>
      </article>
      <article>
        <span className="stat-icon stat-icon--amber">
          <Clock3 size={20} />
        </span>
        <div>
          <small>Em andamento</small>
          <strong>{stats.active}</strong>
          <em>missões ativas</em>
        </div>
      </article>
      <article>
        <span className="stat-icon stat-icon--green">
          <CheckCircle2 size={20} />
        </span>
        <div>
          <small>Concluídos</small>
          <strong>{stats.completed}</strong>
          <em>objetivos alcançados</em>
        </div>
      </article>
      <article>
        <span className="stat-ring" style={ringStyle}>
          {stats.average}%
        </span>
        <div>
          <small>Progresso médio</small>
          <strong>{stats.average}%</strong>
          <em>de conclusão geral</em>
        </div>
      </article>
    </section>
  );
}
