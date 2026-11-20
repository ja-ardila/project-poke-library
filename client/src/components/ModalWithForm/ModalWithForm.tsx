import { useEffect } from 'react';

interface ModalWithFormProps {
  children: React.ReactNode;
  isOpen: boolean;
  name: string;
  title: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function ModalWithForm({
  children,
  isOpen,
  name,
  title,
  onClose,
  onSubmit,
}: ModalWithFormProps): React.JSX.Element | null {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const titleId = name + '-title';

  return (
    <div
      className="modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          className="modal__close"
          type="button"
          aria-label="Cerrar ventana"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="modal__title" id={titleId}>
          {title}
        </h2>
        <form className="modal__form" name={name} onSubmit={onSubmit}>
          {children}
        </form>
      </section>
    </div>
  );
}

export default ModalWithForm;

