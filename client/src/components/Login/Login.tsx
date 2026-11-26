import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import type { LoginCredentials } from '../../interfaces';
import useFormValidation from '../../hooks/useFormValidation';
import { getAuthInputError } from '../../utils/validation';
import Button from '../Button/Button';

interface LoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
}

function Login({ onLogin }: LoginProps): React.JSX.Element {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, isValid, validateInput, validateForm } =
    useFormValidation(false, getAuthInputError);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!validateForm(event.currentTarget) || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onLogin(credentials);
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

        <form
          aria-busy={isSubmitting}
          className="auth-form"
          noValidate
          onSubmit={handleSubmit}
        >
          <label className="auth-form__field">
            <span className="auth-form__label">Correo electrónico</span>
            <input
              aria-describedby="login-email-input-error"
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              className={`auth-form__input ${
                errors.email ? 'auth-form__input_type_error' : ''
              }`}
              id="login-email-input"
              name="email"
              placeholder="nombre@correo.com"
              required
              type="email"
              value={credentials.email}
              onBlur={(event) => validateInput(event.currentTarget)}
              onChange={(event) => {
                setCredentials((currentCredentials) => ({
                  ...currentCredentials,
                  email: event.target.value,
                }));
                validateInput(event.currentTarget);
              }}
            />
            <span
              className={`auth-form__input-error ${
                errors.email ? 'auth-form__input-error_active' : ''
              }`}
              id="login-email-input-error"
            >
              {errors.email}
            </span>
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Contraseña</span>
            <input
              aria-describedby="login-password-input-error"
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              className={`auth-form__input ${
                errors.password ? 'auth-form__input_type_error' : ''
              }`}
              id="login-password-input"
              maxLength={72}
              minLength={8}
              name="password"
              placeholder="Tu contraseña"
              required
              type="password"
              value={credentials.password}
              onBlur={(event) => validateInput(event.currentTarget)}
              onChange={(event) => {
                setCredentials((currentCredentials) => ({
                  ...currentCredentials,
                  password: event.target.value,
                }));
                validateInput(event.currentTarget);
              }}
            />
            <span
              className={`auth-form__input-error ${
                errors.password ? 'auth-form__input-error_active' : ''
              }`}
              id="login-password-input-error"
            >
              {errors.password}
            </span>
          </label>

          <Button
            className="auth-form__submit"
            disabled={!isValid || isSubmitting}
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
