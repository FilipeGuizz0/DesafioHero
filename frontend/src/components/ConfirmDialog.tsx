import { Trash2 } from 'lucide-react';

interface Props {
  projectName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ projectName, onCancel, onConfirm }: Props) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <span className="confirm-dialog__icon">
          <Trash2 size={22} />
        </span>
        <h2 id="confirm-delete-title">Excluir projeto?</h2>
        <p>A missão “{projectName}” será removida permanentemente.</p>
        <div>
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="button button--danger" onClick={onConfirm}>
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}
