import Popup from '../Popup/Popup';

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
  const titleId = name + '-title';

  return (
    <Popup
      contentClassName="popup__content_type_form"
      isOpen={isOpen}
      onClose={onClose}
      titleId={titleId}
    >
      <h2 className="popup__title" id={titleId}>
        {title}
      </h2>
      <form className="popup__form" name={name} onSubmit={onSubmit}>
        {children}
      </form>
    </Popup>
  );
}

export default ModalWithForm;

