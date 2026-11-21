import { Router } from "express";

import { pokemonRouter } from "./pokemon.js";
import { usersRouter } from "./users.js";
import { HttpError } from "../utils/errors.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/pokemon", pokemonRouter);
router.use(() => {
  throw new HttpError(404, "Recurso solicitado no encontrado");
});

export default router;
