import { API_BASE_URL } from './constants';

interface ApiErrorResponse {
  message?: string;
}

class ApiError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(API_BASE_URL + path, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    throw new ApiError(
      0,
      'No pudimos conectar con el servidor. Comprueba que la API esté activa.',
    );
  }

  const responseBody = (await response.json().catch(() => ({}))) as
    | T
    | ApiErrorResponse;

  if (!response.ok) {
    const errorBody = responseBody as ApiErrorResponse;
    const message =
      typeof errorBody.message === 'string'
        ? errorBody.message
        : 'No pudimos completar la solicitud.';

    throw new ApiError(response.status, message);
  }

  return responseBody as T;
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export { ApiError, getApiErrorMessage, requestJson };
