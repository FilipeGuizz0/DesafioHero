import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { hero } from '../test/fixtures';
import { ProjectModal } from './ProjectModal';

describe('ProjectModal', () => {
  it('envia os dados de um novo projeto', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <ProjectModal project={null} heroes={[hero]} onClose={vi.fn()} onSave={onSave} />,
    );

    fireEvent.change(screen.getByLabelText('Nome do projeto'), {
      target: { value: 'Operação Aranha' },
    });
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Proteger toda a cidade durante a missão.' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'em andamento' },
    });
    fireEvent.click(screen.getByRole('button', { name: /salvar projeto/i }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Operação Aranha',
        status: 'em andamento',
        responsibleId: hero.id,
      }),
    );
  });

  it('mostra a mensagem retornada quando o salvamento falha', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Projeto duplicado'));
    render(
      <ProjectModal project={null} heroes={[hero]} onClose={vi.fn()} onSave={onSave} />,
    );

    fireEvent.change(screen.getByLabelText('Nome do projeto'), {
      target: { value: 'Operação Aranha' },
    });
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Proteger toda a cidade durante a missão.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /salvar projeto/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Projeto duplicado');
  });
});
