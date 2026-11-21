import mongoose from "mongoose";

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
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "El identificador del Pokémon debe ser un número entero",
      },
    },
    pokemonName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    imageUrl: {
      type: String,
      required: true,
      match: [URL_REGEX, "La imagen debe ser una URL válida"],
    },
    types: {
      type: [String],
      required: true,
      validate: {
        validator: (types: string[]) => types.length >= 1 && types.length <= 2,
        message: "El Pokémon debe tener uno o dos tipos",
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
      maxlength: 1000,
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
