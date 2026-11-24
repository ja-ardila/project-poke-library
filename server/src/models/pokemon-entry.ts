import mongoose from "mongoose";

import {
  ERROR_MESSAGES,
  POKEMON_LIMITS,
} from "../utils/constants.js";
import { URL_REGEX } from "../utils/validation.js";

const POKEMON_PREFERENCES = ["favorite", "disliked"] as const;
type PokemonPreference = (typeof POKEMON_PREFERENCES)[number];

interface IPokemonEntry {
  pokemonId: number;
  pokemonName: string;
  imageUrl: string;
  types: string[];
  preference: PokemonPreference;
  note: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const pokemonEntrySchema = new mongoose.Schema<IPokemonEntry>(
  {
    pokemonId: {
      type: Number,
      required: true,
      min: POKEMON_LIMITS.ID_MIN_VALUE,
      validate: {
        validator: Number.isInteger,
        message: ERROR_MESSAGES.INVALID_POKEMON_ID,
      },
    },
    pokemonName: {
      type: String,
      required: true,
      trim: true,
      minlength: POKEMON_LIMITS.NAME_MIN_LENGTH,
      maxlength: POKEMON_LIMITS.NAME_MAX_LENGTH,
    },
    imageUrl: {
      type: String,
      required: true,
      match: [URL_REGEX, ERROR_MESSAGES.INVALID_IMAGE_URL],
    },
    types: {
      type: [String],
      required: true,
      validate: {
        validator: (types: string[]) =>
          types.length >= POKEMON_LIMITS.TYPES_MIN_LENGTH &&
          types.length <= POKEMON_LIMITS.TYPES_MAX_LENGTH,
        message: ERROR_MESSAGES.INVALID_POKEMON_TYPES,
      },
    },
    preference: {
      type: String,
      enum: POKEMON_PREFERENCES,
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: POKEMON_LIMITS.NOTE_MAX_LENGTH,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

pokemonEntrySchema.index({ owner: 1, pokemonId: 1 }, { unique: true });

const PokemonEntry = mongoose.model<IPokemonEntry>(
  "PokemonEntry",
  pokemonEntrySchema,
);

export { POKEMON_PREFERENCES };
export type { IPokemonEntry, PokemonPreference };
export default PokemonEntry;
