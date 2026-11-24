import { useState } from 'react';

type ValidationErrors = Record<string, string>;

type GetCustomError = (input: HTMLInputElement) => string;

function useFormValidation(
  initialIsValid = false,
  getCustomError?: GetCustomError,
) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValid, setIsValid] = useState(initialIsValid);

  function applyCustomValidation(input: HTMLInputElement): void {
    input.setCustomValidity('');
    input.setCustomValidity(getCustomError?.(input) ?? '');
  }

  function validateInput(input: HTMLInputElement): void {
    applyCustomValidation(input);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [input.name]: input.validationMessage,
    }));
    setIsValid(input.form?.checkValidity() ?? false);
  }

  function validateForm(form: HTMLFormElement): boolean {
    const inputs = Array.from(form.elements).filter(
      (element): element is HTMLInputElement =>
        element instanceof HTMLInputElement,
    );

    inputs.forEach(applyCustomValidation);

    const nextErrors = inputs.reduce<ValidationErrors>((result, input) => {
      result[input.name] = input.validationMessage;
      return result;
    }, {});
    const formIsValid = form.checkValidity();

    setErrors(nextErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }

  return { errors, isValid, validateInput, validateForm };
}

export default useFormValidation;
