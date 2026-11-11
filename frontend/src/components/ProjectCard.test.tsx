import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createProject } from '../test/fixtures';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  it('exibe os dados principais do projeto', () => {
    render(
      <ProjectCard
        project={createProject()}
        canManage={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('Operação Aurora')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('Homem-Aranha')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('aciona edição e exclusão para administradores', () => {
    const project = createProject();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <ProjectCard project={project} canManage onEdit={onEdit} onDelete={onDelete} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));

    expect(onEdit).toHaveBeenCalledWith(project);
    expect(onDelete).toHaveBeenCalledWith(project);
  });
});
