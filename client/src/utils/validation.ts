function getAuthInputError(input: HTMLInputElement): string {
  const value = input.value.trim();

  if (input.name === 'name') {
    if (!value) {
      return 'Introduce tu nombre.';
    }

    if (value.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres.';
    }
  }

  if (input.name === 'email') {
    if (!value) {
      return 'Introduce tu correo electrónico.';
    }

    if (input.validity.typeMismatch) {
      return 'Introduce una dirección de correo válida.';
    }
  }

  if (input.name === 'password') {
    if (!input.value) {
      return 'Introduce tu contraseña.';
    }

    if (input.value.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
  }

  return '';
}

export { getAuthInputError };
