import { Request, Response } from "express";

class SessionsController {
  create(request: Request, response: Response) {
    return response.json({ message: "Sessão criada com sucesso!" });
  }
}

export { SessionsController }