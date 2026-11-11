import { FolderKanban, LayoutDashboard, LogOut, Shield, Sparkles, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  projectCount: number;
  onClose: () => void;
  onLogout: () => void;
}

export function DashboardSidebar({ isOpen, projectCount, onClose, onLogout }: Props) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="brand sidebar__brand">
          <span className="brand__mark">
            <Shield size={22} />
          </span>
          <span>HeroForce</span>
          <button
            type="button"
            className="mobile-close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav aria-label="Navegação principal">
          <span className="nav-label">COMANDO</span>
          <a className="active" href="#dashboard">
            <LayoutDashboard size={19} /> Visão geral
          </a>
          <a href="#projects">
            <FolderKanban size={19} /> Projetos <b>{projectCount}</b>
          </a>
        </nav>

        <div className="sidebar__quote">
          <Sparkles size={18} />
          <p>“Grandes poderes trazem grandes responsabilidades.”</p>
        </div>

        <button type="button" className="sidebar__logout" onClick={onLogout}>
          <LogOut size={18} /> Sair da base
        </button>
      </aside>

      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      )}
    </>
  );
}
