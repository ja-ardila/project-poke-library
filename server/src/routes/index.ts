import { Router } from "express";

import { authRouter } from "./auth.js";
import { pokemonRouter } from "./pokemon.js";
import { usersRouter } from "./users.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../utils/constants.js";
import { HttpError } from "../utils/errors.js";

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.use(authRouter);

protectedRouter.use("/users", usersRouter);
protectedRouter.use("/pokemon", pokemonRouter);
protectedRouter.use(() => {
  throw new HttpError(
    HTTP_STATUS.NOT_FOUND,
    ERROR_MESSAGES.ROUTE_NOT_FOUND,
  );
});

export { protectedRouter, publicRouter };
