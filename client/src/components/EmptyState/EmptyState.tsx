import Button from '../Button/Button';

interface EmptyStateProps {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
  title: string;
}

function EmptyState({
  actionLabel,
  message,
  onAction,
  title,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className="empty-state">
      <div className="empty-state__pokeball" aria-hidden="true" />
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__text">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

