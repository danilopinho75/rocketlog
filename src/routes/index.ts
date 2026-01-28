import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./session-routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

export { routes };