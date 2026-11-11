import { FormEvent, useState } from 'react';
import { Save, X } from 'lucide-react';
import type {
  Project,
  ProjectGoals,
  ProjectPayload,
  ProjectStatus,
  User,
} from '../types';

const emptyGoals: ProjectGoals = {
  agility: 70,
  delight: 70,
  efficiency: 70,
  excellence: 70,
  transparency: 70,
  ambition: 70,
};

const goalLabels: Record<keyof ProjectGoals, string> = {
  agility: 'Agilidade',
  delight: 'Encantamento',
  efficiency: 'Eficiência',
  excellence: 'Excelência',
  transparency: 'Transparência',
  ambition: 'Ambição',
};

interface Props {
  project: Project | null;
  heroes: User[];
  onClose: () => void;
  onSave: (payload: ProjectPayload) => Promise<void>;
}

export function ProjectModal({ project, heroes, onClose, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ProjectPayload>(() => {
    if (project) {
      return {
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress,
        goals: project.goals,
        responsibleId: project.responsibleId,
      };
    }
    return {
      name: '',
      description: '',
      status: 'pendente',
      progress: 0,
      goals: emptyGoals,
      responsibleId: heroes[0]?.id || '',
    };
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(form);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Não foi possível salvar.',
      );
    } finally {
      setSaving(false);
    }
  };

  const changeGoal = (key: keyof ProjectGoals, value: number) => {
    setForm({ ...form, goals: { ...form.goals, [key]: value } });
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <header className="modal__header">
          <div>
            <span>MISSÃO</span>
            <h2 id="project-modal-title">
              {project ? 'Editar projeto' : 'Novo projeto heroico'}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X size={21} />
          </button>
        </header>
        <form onSubmit={submit} className="modal__body">
          <label>
            Nome do projeto
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              minLength={3}
              required
            />
          </label>
          <label>
            Descrição
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              minLength={10}
              rows={3}
              required
            />
          </label>
          <div className="field-row field-row--three">
            <label>
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as ProjectStatus })
                }
              >
                <option value="pendente">Pendente</option>
                <option value="em andamento">Em andamento</option>
                <option value="concluído">Concluído</option>
              </select>
            </label>
            <label>
              Responsável
              <select
                value={form.responsibleId}
                onChange={(event) =>
                  setForm({ ...form, responsibleId: event.target.value })
                }
                required
              >
                <option value="" disabled>
                  Selecione
                </option>
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.character} — {hero.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Conclusão: {form.progress}%
              <input
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={(event) =>
                  setForm({ ...form, progress: Number(event.target.value) })
                }
              />
            </label>
          </div>

          <fieldset className="goals-fieldset">
            <legend>Metas do projeto</legend>
            <p>Defina o nível esperado para cada valor da HeroForce.</p>
            <div className="goals-grid">
              {(Object.keys(goalLabels) as Array<keyof ProjectGoals>).map((key) => (
                <label key={key}>
                  <span>
                    {goalLabels[key]} <b>{form.goals[key]}</b>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.goals[key]}
                    onChange={(event) => changeGoal(key, Number(event.target.value))}
                  />
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <footer className="modal__footer">
            <button type="button" className="button button--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={saving || !form.responsibleId}
            >
              <Save size={17} /> {saving ? 'Salvando...' : 'Salvar projeto'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
