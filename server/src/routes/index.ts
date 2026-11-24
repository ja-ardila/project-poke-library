import { Router } from "express";

import { pokemonRouter } from "./pokemon.js";
import { usersRouter } from "./users.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../utils/constants.js";
import { HttpError } from "../utils/errors.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/pokemon", pokemonRouter);
router.use(() => {
  throw new HttpError(
    HTTP_STATUS.NOT_FOUND,
    ERROR_MESSAGES.ROUTE_NOT_FOUND,
  );
});

export default router;
