import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

import type { LoginCredentials } from '../../interfaces';
import { getApiErrorMessage } from '../../utils/http';
import Button from '../Button/Button';

interface LoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
}

interface LoginLocationState {
  from?: string;
  registrationSuccess?: boolean;
  sessionExpired?: boolean;
}

function Login({ onLogin }: LoginProps): React.JSX.Element {
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onLogin({ email, password });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'No pudimos iniciar sesión. Inténtalo nuevamente.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page page__section">
      <section className="auth-card" aria-labelledby="signin-title">
        <p className="auth-card__eyebrow">Tu biblioteca personal</p>
        <h1 className="auth-card__title" id="signin-title">
          Iniciar sesión
        </h1>
        <p className="auth-card__description">
          Accede a tus favoritos, Pokémon que no te gustan y notas personales.
        </p>

        {locationState?.registrationSuccess && (
          <p className="auth-card__status auth-card__status_success" role="status">
            Tu cuenta fue creada correctamente. Ya puedes iniciar sesión.
          </p>
        )}

        {locationState?.sessionExpired && (
          <p className="auth-card__status" role="alert">
            Tu sesión expiró. Inicia sesión nuevamente.
          </p>
        )}

        {locationState?.from && !locationState.sessionExpired && (
          <p className="auth-card__status" role="status">
            Inicia sesión para acceder a tu biblioteca.
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__field">
            <span className="auth-form__label">Correo electrónico</span>
            <input
              className="auth-form__input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Contraseña</span>
            <input
              className="auth-form__input"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              minLength={8}
              maxLength={72}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {errorMessage && (
            <p className="auth-form__error" role="alert">
              {errorMessage}
            </p>
          )}

          <Button
            className="auth-form__submit"
            isLoading={isSubmitting}
            loadingLabel="Iniciando sesión"
            type="submit"
          >
            Iniciar sesión
          </Button>
        </form>

        <p className="auth-card__alternative">
          ¿Aún no tienes una cuenta?{' '}
          <Link className="auth-card__link" to="/signup">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
