import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import type { RegisterData } from '../../interfaces';
import { getApiErrorMessage } from '../../utils/http';
import Button from '../Button/Button';

interface RegisterProps {
  onRegister: (data: RegisterData) => Promise<void>;
}

function Register({ onRegister }: RegisterProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onRegister({ name, email, password });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'No pudimos crear tu cuenta. Inténtalo nuevamente.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page page__section">
      <section className="auth-card" aria-labelledby="signup-title">
        <p className="auth-card__eyebrow">Crea tu espacio</p>
        <h1 className="auth-card__title" id="signup-title">
          Registrarse
        </h1>
        <p className="auth-card__description">
          Organiza tus preferencias y guarda notas privadas sobre cada Pokémon.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__field">
            <span className="auth-form__label">Nombre</span>
            <input
              className="auth-form__input"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Tu nombre"
              minLength={2}
              maxLength={30}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

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
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
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
            loadingLabel="Creando cuenta"
            type="submit"
          >
            Registrarse
          </Button>
        </form>

        <p className="auth-card__alternative">
          ¿Ya tienes una cuenta?{' '}
          <Link className="auth-card__link" to="/signin">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
