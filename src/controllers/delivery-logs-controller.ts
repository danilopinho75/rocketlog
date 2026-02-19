import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import z from "zod";

class DeliveryLogsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    })

    const { delivery_id, description } = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id
      }
    })

    if(!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    if (delivery.status === "delivered") {
      throw new AppError("Esse pedido já foi entregue, não é possível adicionar um log");
    }

    if (delivery.status === "processing") {
      throw new AppError("Altere o status do pedido para 'shipped' antes de adicionar um log");
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description
      }
    })

    return response.status(201).json({ message: "Delivery log created successfully" });
  }

  async show(request: Request, response: Response) {
    const paramSchema = z.object({
      delivery_id: z.string().uuid()
    })

    const { delivery_id } = paramSchema.parse(request.params);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id }
    });

    if(request.user?.role === "customer" && request.user.id !== delivery?.userId) {
      throw new AppError("O usuário pode ver somente os seus próprios pedidos", 401);
    }

    return response.status(200).json(delivery);
  }
}

export { DeliveryLogsController };