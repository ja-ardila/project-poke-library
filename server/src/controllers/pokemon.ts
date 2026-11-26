import type { Request, Response } from "express";
import type { HydratedDocument } from "mongoose";

import PokemonEntry, {
  POKEMON_PREFERENCES,
} from "../models/pokemon-entry.js";
import type {
  IPokemonEntry,
  PokemonPreference,
} from "../models/pokemon-entry.js";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  POKEMON_LIMITS,
} from "../utils/constants.js";
import { HttpError } from "../utils/errors.js";

type PokemonEntryDocument = HydratedDocument<IPokemonEntry>;

const getCurrentUserId = (req: Request): string => {
  const userId = req.user?._id;

  if (!userId) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.AUTH_REQUIRED);
  }

  return userId;
};

const isPokemonPreference = (value: unknown): value is PokemonPreference =>
  typeof value === "string" &&
  POKEMON_PREFERENCES.some((preference) => preference === value);

const getSafePokemonData = (entry: PokemonEntryDocument) => ({
  _id: entry._id,
  pokemonId: entry.pokemonId,
  pokemonName: entry.pokemonName,
  imageUrl: entry.imageUrl,
  types: entry.types,
  preference: entry.preference,
  note: entry.note,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
});

const checkEntryOwner = (
  entry: PokemonEntryDocument,
  userId: string,
): void => {
  if (entry.owner.toString() !== userId) {
    throw new HttpError(
      HTTP_STATUS.FORBIDDEN,
      ERROR_MESSAGES.FORBIDDEN_POKEMON,
    );
  }
};

const getPokemonEntries = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const owner = getCurrentUserId(req);
  const preference = req.query.preference;

  if (preference !== undefined && !isPokemonPreference(preference)) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.INVALID_PREFERENCE,
    );
  }

  const filter = preference ? { owner, preference } : { owner };
  const entries = await PokemonEntry.find(filter).sort({ updatedAt: -1 });

  res.status(HTTP_STATUS.OK).json(entries.map(getSafePokemonData));
};

const createPokemonEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { pokemonId, pokemonName, imageUrl, types, preference, note } =
    req.body as Record<string, unknown>;

  if (
    !Number.isInteger(pokemonId) ||
    typeof pokemonId !== "number" ||
    pokemonId < POKEMON_LIMITS.ID_MIN_VALUE ||
    typeof pokemonName !== "string" ||
    !pokemonName.trim() ||
    typeof imageUrl !== "string" ||
    !imageUrl.trim() ||
    !Array.isArray(types) ||
    types.length < POKEMON_LIMITS.TYPES_MIN_LENGTH ||
    types.length > POKEMON_LIMITS.TYPES_MAX_LENGTH ||
    !types.every((type) => typeof type === "string" && type.trim()) ||
    !isPokemonPreference(preference) ||
    (note !== undefined && typeof note !== "string")
  ) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.INVALID_POKEMON_DATA,
    );
  }

  const entry = await PokemonEntry.create({
    pokemonId,
    pokemonName: pokemonName.trim(),
    imageUrl: imageUrl.trim(),
    types: types.map((type) => type.trim().toLowerCase()),
    preference,
    note: typeof note === "string" ? note.trim() : "",
    owner: getCurrentUserId(req),
  });

  res.status(HTTP_STATUS.CREATED).json(getSafePokemonData(entry));
};

const updatePokemonEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const hasPreference = Object.hasOwn(body, "preference");
  const hasNote = Object.hasOwn(body, "note");

  if (!hasPreference && !hasNote) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.UPDATE_REQUIRED,
    );
  }

  if (hasPreference && !isPokemonPreference(body.preference)) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.INVALID_PREFERENCE,
    );
  }

  if (hasNote && typeof body.note !== "string") {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_NOTE);
  }

  const userId = getCurrentUserId(req);
  const entry = await PokemonEntry.findById(req.params.id);

  if (!entry) {
    throw new HttpError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_MESSAGES.POKEMON_NOT_FOUND,
    );
  }

  checkEntryOwner(entry, userId);

  if (hasPreference && isPokemonPreference(body.preference)) {
    entry.preference = body.preference;
  }

  if (hasNote && typeof body.note === "string") {
    entry.note = body.note.trim();
  }

  await entry.save();
  res.status(HTTP_STATUS.OK).json(getSafePokemonData(entry));
};

const deletePokemonEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getCurrentUserId(req);
  const entry = await PokemonEntry.findById(req.params.id);

  if (!entry) {
    throw new HttpError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_MESSAGES.POKEMON_NOT_FOUND,
    );
  }

  checkEntryOwner(entry, userId);
  await entry.deleteOne();

  res.status(HTTP_STATUS.OK).json(getSafePokemonData(entry));
};

export {
  createPokemonEntry,
  deletePokemonEntry,
  getPokemonEntries,
  updatePokemonEntry,
};
