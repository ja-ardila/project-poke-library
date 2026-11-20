import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

function Button({
  children,
  className = '',
  disabled,
  isLoading = false,
  loadingLabel = 'Cargando',
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ButtonProps): React.JSX.Element {
  const classes = [
    'button',
    'button_variant_' + variant,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...buttonProps}
      className={classes}
      disabled={disabled || isLoading}
      type={type}
    >
      {isLoading && <span className="button__spinner" aria-hidden="true" />}
      <span>{isLoading ? loadingLabel : children}</span>
    </button>
  );
}

export default Button;

