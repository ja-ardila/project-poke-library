const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

const USER_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 72,
} as const;

const POKEMON_LIMITS = {
  ID_MIN_VALUE: 1,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
  TYPES_MIN_LENGTH: 1,
  TYPES_MAX_LENGTH: 2,
  NOTE_MAX_LENGTH: 1000,
} as const;

const DATABASE_CONFIG = {
  MAX_POOL_SIZE: 10,
  CONNECT_TIMEOUT_MS: 8000,
  SERVER_SELECTION_TIMEOUT_MS: 8000,
} as const;

const RATE_LIMIT_CONFIG = {
  API: {
    WINDOW_MS: 15 * 60 * 1000,
    LIMIT: 300,
  },
  LOGIN: {
    WINDOW_MS: 15 * 60 * 1000,
    LIMIT: 10,
  },
  REGISTER: {
    WINDOW_MS: 60 * 60 * 1000,
    LIMIT: 20,
  },
} as const;

const BCRYPT_SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "7d";
const REQUEST_BODY_LIMIT = "20kb";
const HEALTH_STATUS = "ok";

const ERROR_MESSAGES = {
  API_RATE_LIMIT: "Demasiadas solicitudes. Inténtalo de nuevo más tarde.",
  AUTH_REQUIRED: "Se requiere autorización",
  AUTH_TOKEN_REQUIRED: "Se requiere un token de autorización",
  CORS_FORBIDDEN: "El origen de la solicitud no está permitido",
  DUPLICATE_EMAIL: "El correo electrónico ya está en uso",
  DUPLICATE_POKEMON: "Este Pokémon ya está guardado en tu biblioteca",
  ENV_REQUIRED:
    "JWT_SECRET, MONGO_URI, PORT y CLIENT_ORIGIN deben estar configuradas",
  FORBIDDEN_POKEMON:
    "No tienes permiso para modificar este Pokémon guardado",
  INTERNAL_SERVER: "Ha ocurrido un error en el servidor",
  INVALID_EMAIL: "El correo electrónico no es válido",
  INVALID_IMAGE_URL: "La imagen debe ser una URL válida",
  INVALID_NAME_LENGTH: "El nombre debe tener entre 2 y 30 caracteres",
  INVALID_NOTE: "La nota debe ser texto",
  INVALID_PASSWORD_LENGTH:
    "La contraseña debe tener entre 8 y 72 caracteres",
  INVALID_POKEMON_DATA: "Los datos del Pokémon guardado no son válidos",
  INVALID_POKEMON_ID: "El identificador del Pokémon debe ser un número entero",
  INVALID_POKEMON_TYPES: "El Pokémon debe tener uno o dos tipos",
  INVALID_PREFERENCE: "La preferencia debe ser favorite o disliked",
  INVALID_TOKEN: "Token inválido o expirado",
  INVALID_USER_DATA: "Los datos enviados no son válidos",
  LOGIN_FIELDS_REQUIRED:
    "El correo electrónico y la contraseña son obligatorios",
  LOGIN_RATE_LIMIT:
    "Demasiados intentos de inicio de sesión. Inténtalo de nuevo más tarde.",
  LOGIN_UNAUTHORIZED: "Correo o contraseña incorrectos",
  POKEMON_NOT_FOUND: "Pokémon guardado no encontrado",
  REGISTER_RATE_LIMIT:
    "Demasiados registros desde esta dirección. Inténtalo de nuevo más tarde.",
  ROUTE_NOT_FOUND: "Recurso solicitado no encontrado",
  UPDATE_REQUIRED: "Envía una preferencia o una nota para actualizar",
  USER_FIELDS_REQUIRED:
    "El correo electrónico, la contraseña y el nombre son obligatorios",
  USER_NOT_FOUND: "Usuario no encontrado",
} as const;

export {
  BCRYPT_SALT_ROUNDS,
  DATABASE_CONFIG,
  ERROR_MESSAGES,
  HEALTH_STATUS,
  HTTP_STATUS,
  JWT_EXPIRES_IN,
  POKEMON_LIMITS,
  RATE_LIMIT_CONFIG,
  REQUEST_BODY_LIMIT,
  USER_LIMITS,
};
