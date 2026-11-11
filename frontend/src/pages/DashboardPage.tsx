import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, FolderKanban, Menu, Plus, Search, X } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardStats } from '../components/DashboardStats';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFilters } from '../components/ProjectFilters';
import { ProjectModal } from '../components/ProjectModal';
import { useAuth } from '../contexts/AuthContext';
import { api, getErrorMessage } from '../services/api';
import type { Project, ProjectPayload, ProjectStatus, User } from '../types';
import { filterProjects, getInitials } from '../utils/projects';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [heroes, setHeroes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [heroFilter, setHeroFilter] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null | undefined>(
    undefined,
  );
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsResponse, heroesResponse] = await Promise.all([
        api.get<Project[]>('/projects'),
        api.get<User[]>('/heroes'),
      ]);
      setProjects(projectsResponse.data);
      setHeroes(heroesResponse.data);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const visibleProjects = useMemo(
    () =>
      filterProjects(projects, {
        search,
        status: statusFilter,
        responsibleId: heroFilter,
      }),
    [projects, search, statusFilter, heroFilter],
  );

  const saveProject = async (payload: ProjectPayload) => {
    try {
      if (editingProject) {
        await api.patch(`/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }

      setEditingProject(undefined);
      setMessage(
        editingProject
          ? 'Projeto atualizado com sucesso.'
          : 'Projeto criado com sucesso.',
      );
      await loadData();
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const deleteProject = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/projects/${deleteTarget.id}`);
      setDeleteTarget(null);
      setMessage('Projeto removido com sucesso.');
      await loadData();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const isAdmin = user?.role === 'admin';
  const initials = user ? getInitials(user.name) : 'HF';

  return (
    <div className="app-shell">
      <DashboardSidebar
        isOpen={mobileMenu}
        projectCount={projects.length}
        onClose={() => setMobileMenu(false)}
        onLogout={logout}
      />

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <button
            type="button"
            className="mobile-menu"
            onClick={() => setMobileMenu(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <div className="topbar__search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar missões..."
              aria-label="Buscar projetos"
            />
          </div>
          <div className="profile">
            <span className="avatar">{initials}</span>
            <span>
              <strong>{user?.name}</strong>
              <small>{user?.character}</small>
            </span>
            <ChevronDown size={16} />
          </div>
        </header>

        <div className="content-wrap">
          <section className="welcome-row">
            <div>
              <span className="eyebrow">CENTRAL DE COMANDO</span>
              <h1>Olá, {user?.character}.</h1>
              <p>Acompanhe o avanço das missões da sua equipe.</p>
            </div>
            {isAdmin && (
              <button
                type="button"
                className="button button--primary"
                onClick={() => setEditingProject(null)}
              >
                <Plus size={18} /> Novo projeto
              </button>
            )}
          </section>

          {message && (
            <button
              type="button"
              className="notice"
              onClick={() => setMessage('')}
              aria-live="polite"
            >
              {message}
              <X size={15} />
            </button>
          )}

          <DashboardStats projects={projects} />

          <section className="projects-section" id="projects">
            <div className="section-heading">
              <div>
                <h2>Projetos heroicos</h2>
                <p>
                  {visibleProjects.length}{' '}
                  {visibleProjects.length === 1
                    ? 'missão encontrada'
                    : 'missões encontradas'}
                </p>
              </div>
              <ProjectFilters
                heroes={heroes}
                status={statusFilter}
                responsibleId={heroFilter}
                onStatusChange={setStatusFilter}
                onResponsibleChange={setHeroFilter}
              />
            </div>

            {loading ? (
              <div className="loading-grid" aria-label="Carregando projetos">
                {[1, 2, 3].map((item) => (
                  <span key={item} />
                ))}
              </div>
            ) : visibleProjects.length ? (
              <div className="projects-grid">
                {visibleProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    canManage={isAdmin}
                    onEdit={setEditingProject}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>
                  <FolderKanban size={29} />
                </span>
                <h3>Nenhuma missão por aqui</h3>
                <p>Ajuste os filtros ou cadastre o primeiro projeto heroico.</p>
                {isAdmin && (
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() => setEditingProject(null)}
                  >
                    <Plus size={17} /> Criar projeto
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {editingProject !== undefined && (
        <ProjectModal
          project={editingProject}
          heroes={heroes}
          onClose={() => setEditingProject(undefined)}
          onSave={saveProject}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          projectName={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void deleteProject()}
        />
      )}
    </div>
  );
}
