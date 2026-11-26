import Preloader from '../Preloader/Preloader';

function AuthLoader(): React.JSX.Element {
  return (
    <main className="auth-loader page__section">
      <Preloader label="Comprobando tu sesión" />
    </main>
  );
}

export default AuthLoader;
