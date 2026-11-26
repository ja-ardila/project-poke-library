import Popup from '../Popup/Popup';

interface InfoTooltipProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type: 'error' | 'success';
}

function InfoTooltip({
  isOpen,
  message,
  onClose,
  type,
}: InfoTooltipProps): React.JSX.Element | null {
  return (
    <Popup
      contentClassName="popup__content_type_info-tooltip"
      isOpen={isOpen}
      onClose={onClose}
      titleId="info-tooltip-title"
    >
      <div
        className={`info-tooltip__icon info-tooltip__icon_type_${type}`}
        aria-hidden="true"
      />
      <h2 className="info-tooltip__title" id="info-tooltip-title">
        {message}
      </h2>
    </Popup>
  );
}

export default InfoTooltip;
