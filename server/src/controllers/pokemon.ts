import type { Request, Response } from "express";
import type { HydratedDocument } from "mongoose";

import PokemonEntry, {
  POKEMON_PREFERENCES,
} from "../models/pokemon-entry.js";
import type {
  IPokemonEntry,
  PokemonPreference,
} from "../models/pokemon-entry.js";
import { HttpError } from "../utils/errors.js";

type PokemonEntryDocument = HydratedDocument<IPokemonEntry>;

const getCurrentUserId = (req: Request): string => {
  const userId = req.user?._id;

  if (!userId) {
    throw new HttpError(401, "Se requiere autorización");
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
      403,
      "No tienes permiso para modificar este Pokémon guardado",
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
      400,
      "La preferencia debe ser favorite o disliked",
    );
  }

  const filter = preference ? { owner, preference } : { owner };
  const entries = await PokemonEntry.find(filter).sort({ updatedAt: -1 });

  res.status(200).json(entries.map(getSafePokemonData));
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
    pokemonId < 1 ||
    typeof pokemonName !== "string" ||
    !pokemonName.trim() ||
    typeof imageUrl !== "string" ||
    !imageUrl.trim() ||
    !Array.isArray(types) ||
    types.length < 1 ||
    types.length > 2 ||
    !types.every((type) => typeof type === "string" && type.trim()) ||
    !isPokemonPreference(preference) ||
    (note !== undefined && typeof note !== "string")
  ) {
    throw new HttpError(400, "Los datos del Pokémon guardado no son válidos");
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

  res.status(201).json(getSafePokemonData(entry));
};

const updatePokemonEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const hasPreference = Object.hasOwn(body, "preference");
  const hasNote = Object.hasOwn(body, "note");

  if (!hasPreference && !hasNote) {
    throw new HttpError(400, "Envía una preferencia o una nota para actualizar");
  }

  if (hasPreference && !isPokemonPreference(body.preference)) {
    throw new HttpError(
      400,
      "La preferencia debe ser favorite o disliked",
    );
  }

  if (hasNote && typeof body.note !== "string") {
    throw new HttpError(400, "La nota debe ser texto");
  }

  const userId = getCurrentUserId(req);
  const entry = await PokemonEntry.findById(req.params.id);

  if (!entry) {
    throw new HttpError(404, "Pokémon guardado no encontrado");
  }

  checkEntryOwner(entry, userId);

  if (hasPreference && isPokemonPreference(body.preference)) {
    entry.preference = body.preference;
  }

  if (hasNote && typeof body.note === "string") {
    entry.note = body.note.trim();
  }

  await entry.save();
  res.status(200).json(getSafePokemonData(entry));
};

const deletePokemonEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = getCurrentUserId(req);
  const entry = await PokemonEntry.findById(req.params.id);

  if (!entry) {
    throw new HttpError(404, "Pokémon guardado no encontrado");
  }

  checkEntryOwner(entry, userId);
  await entry.deleteOne();

  res.status(200).json(getSafePokemonData(entry));
};

export {
  createPokemonEntry,
  deletePokemonEntry,
  getPokemonEntries,
  updatePokemonEntry,
};
