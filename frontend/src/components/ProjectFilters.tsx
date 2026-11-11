import type { ProjectStatus, User } from '../types';

interface Props {
  heroes: User[];
  status: ProjectStatus | '';
  responsibleId: string;
  onStatusChange: (status: ProjectStatus | '') => void;
  onResponsibleChange: (responsibleId: string) => void;
}

export function ProjectFilters({
  heroes,
  status,
  responsibleId,
  onStatusChange,
  onResponsibleChange,
}: Props) {
  return (
    <div className="filters">
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as ProjectStatus | '')}
        aria-label="Filtrar por status"
      >
        <option value="">Todos os status</option>
        <option value="pendente">Pendente</option>
        <option value="em andamento">Em andamento</option>
        <option value="concluído">Concluído</option>
      </select>
      <select
        value={responsibleId}
        onChange={(event) => onResponsibleChange(event.target.value)}
        aria-label="Filtrar por herói"
      >
        <option value="">Todos os heróis</option>
        {heroes.map((hero) => (
          <option key={hero.id} value={hero.id}>
            {hero.character}
          </option>
        ))}
      </select>
    </div>
  );
}
