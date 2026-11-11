import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProject, hero } from '../test/fixtures';
import { DashboardPage } from './DashboardPage';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('../services/api', () => ({
  api: {
    get: mocks.get,
    post: mocks.post,
    patch: mocks.patch,
    delete: mocks.delete,
  },
  getErrorMessage: () => 'Erro ao carregar dados',
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { ...hero, role: 'admin' },
    logout: mocks.logout,
  }),
}));

describe('DashboardPage', () => {
  const projects = [
    createProject({ id: '1', name: 'Operação Aurora' }),
    createProject({
      id: '2',
      name: 'Escudo Solar',
      status: 'concluído',
      progress: 100,
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockImplementation((url: string) => {
      if (url === '/projects') return Promise.resolve({ data: projects });
      if (url === '/heroes') return Promise.resolve({ data: [hero] });
      return Promise.reject(new Error(`Rota inesperada: ${url}`));
    });
  });

  it('carrega projetos, calcula indicadores e aplica filtro', async () => {
    render(<DashboardPage />);

    expect(await screen.findByText('Operação Aurora')).toBeInTheDocument();
    expect(screen.getByText('Escudo Solar')).toBeInTheDocument();
    expect(screen.getByText('2 missões encontradas')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filtrar por status'), {
      target: { value: 'concluído' },
    });

    expect(screen.queryByText('Operação Aurora')).not.toBeInTheDocument();
    expect(screen.getByText('Escudo Solar')).toBeInTheDocument();
    expect(screen.getByText('1 missão encontrada')).toBeInTheDocument();
  });

  it('abre o formulário de criação para o administrador', async () => {
    render(<DashboardPage />);
    await waitFor(() => expect(mocks.get).toHaveBeenCalledTimes(2));

    fireEvent.click(screen.getByRole('button', { name: /novo projeto/i }));

    expect(
      screen.getByRole('dialog', { name: /novo projeto heroico/i }),
    ).toBeInTheDocument();
  });
});
