import { useEffect, useRef } from 'react';

interface PopupProps {
  children: React.ReactNode;
  contentClassName?: string;
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
}

function Popup({
  children,
  contentClassName = '',
  isOpen,
  onClose,
  titleId,
}: PopupProps): React.JSX.Element | null {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="popup"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className={['popup__content', contentClassName]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          className="popup__close"
          ref={closeButtonRef}
          type="button"
          aria-label="Cerrar ventana"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </section>
    </div>
  );
}

export default Popup;

