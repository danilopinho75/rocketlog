import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { z } from "zod";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email }
    }) 

    if(!user) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const passwordMatched = await compare(password, user.password)

    if(!passwordMatched) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role ?? "customer" }, secret, {
      subject: user.id,
      expiresIn,
    })

    return response.json({ message: "Sessão criada com sucesso!", token });
  }
}

export { SessionsController }