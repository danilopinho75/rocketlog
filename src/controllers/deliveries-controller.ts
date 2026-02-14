import { Request, Response } from "express";

class DeliveriesController {
  create(request: Request, response: Response) {
    return response.send("Delivery created");
  }
}

export { DeliveriesController };