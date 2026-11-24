import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import useFormValidation from '../../hooks/useFormValidation';
import type { RegisterData } from '../../interfaces';
import { getAuthInputError } from '../../utils/validation';
import Button from '../Button/Button';

interface RegisterProps {
  onRegister: (data: RegisterData) => Promise<void>;
}

function Register({ onRegister }: RegisterProps): React.JSX.Element {
  const [data, setData] = useState<RegisterData>({
    name: '',
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
      await onRegister(data);
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

        <form
          aria-busy={isSubmitting}
          className="auth-form"
          noValidate
          onSubmit={handleSubmit}
        >
          <label className="auth-form__field">
            <span className="auth-form__label">Nombre</span>
            <input
              aria-describedby="register-name-input-error"
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              className={`auth-form__input ${
                errors.name ? 'auth-form__input_type_error' : ''
              }`}
              id="register-name-input"
              maxLength={30}
              minLength={2}
              name="name"
              placeholder="Tu nombre"
              required
              type="text"
              value={data.name}
              onBlur={(event) => validateInput(event.currentTarget)}
              onChange={(event) => {
                setData((currentData) => ({
                  ...currentData,
                  name: event.target.value,
                }));
                validateInput(event.currentTarget);
              }}
            />
            <span
              className={`auth-form__input-error ${
                errors.name ? 'auth-form__input-error_active' : ''
              }`}
              id="register-name-input-error"
            >
              {errors.name}
            </span>
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Correo electrónico</span>
            <input
              aria-describedby="register-email-input-error"
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              className={`auth-form__input ${
                errors.email ? 'auth-form__input_type_error' : ''
              }`}
              id="register-email-input"
              name="email"
              placeholder="nombre@correo.com"
              required
              type="email"
              value={data.email}
              onBlur={(event) => validateInput(event.currentTarget)}
              onChange={(event) => {
                setData((currentData) => ({
                  ...currentData,
                  email: event.target.value,
                }));
                validateInput(event.currentTarget);
              }}
            />
            <span
              className={`auth-form__input-error ${
                errors.email ? 'auth-form__input-error_active' : ''
              }`}
              id="register-email-input-error"
            >
              {errors.email}
            </span>
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Contraseña</span>
            <input
              aria-describedby="register-password-input-error"
              aria-invalid={Boolean(errors.password)}
              autoComplete="new-password"
              className={`auth-form__input ${
                errors.password ? 'auth-form__input_type_error' : ''
              }`}
              id="register-password-input"
              maxLength={72}
              minLength={8}
              name="password"
              placeholder="Mínimo 8 caracteres"
              required
              type="password"
              value={data.password}
              onBlur={(event) => validateInput(event.currentTarget)}
              onChange={(event) => {
                setData((currentData) => ({
                  ...currentData,
                  password: event.target.value,
                }));
                validateInput(event.currentTarget);
              }}
            />
            <span
              className={`auth-form__input-error ${
                errors.password ? 'auth-form__input-error_active' : ''
              }`}
              id="register-password-input-error"
            >
              {errors.password}
            </span>
          </label>

          <Button
            className="auth-form__submit"
            disabled={!isValid || isSubmitting}
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
