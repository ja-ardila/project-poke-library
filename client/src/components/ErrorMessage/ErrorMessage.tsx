import Button from '../Button/Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps): React.JSX.Element {
  return (
    <div className="error-message" role="alert">
      <div className="error-message__icon" aria-hidden="true">
        !
      </div>
      <div className="error-message__content">
        <p className="error-message__title">No pudimos completar la solicitud</p>
        <p className="error-message__text">{message}</p>
      </div>
      {onRetry && (
        <Button
          className="error-message__button"
          variant="secondary"
          onClick={onRetry}
        >
          Reintentar
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;

