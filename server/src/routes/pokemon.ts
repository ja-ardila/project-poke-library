import { Router } from "express";

import {
  createPokemonEntry,
  deletePokemonEntry,
  getPokemonEntries,
  updatePokemonEntry,
} from "../controllers/pokemon.js";

const pokemonRouter = Router();

pokemonRouter.get("/", getPokemonEntries);
pokemonRouter.post("/", createPokemonEntry);
pokemonRouter.patch("/:id", updatePokemonEntry);
pokemonRouter.delete("/:id", deletePokemonEntry);

export { pokemonRouter };
