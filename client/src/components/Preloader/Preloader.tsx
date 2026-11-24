interface PreloaderProps {
  label?: string;
}

function Preloader({
  label = 'Cargando Pokémon',
}: PreloaderProps): React.JSX.Element {
  return (
    <div className="preloader" role="status" aria-live="polite">
      <span className="preloader__circle" aria-hidden="true" />
      <span className="preloader__label">{label}</span>
    </div>
  );
}

export default Preloader;

