import { Router } from "express"
import vehiclesController from "../controllers/vehicles.controller.js"

const vehicleRouter = Router()

//GET /vehicles
vehicleRouter.get("/", vehiclesController.index);
//GET /vehicles/:id
vehicleRouter.get("/:id", vehiclesController.show);

//POST /vehicles
vehicleRouter.post("/", vehiclesController.create)

//PUT /vehicles/:id
vehicleRouter.put("/:id", vehiclesController.update)

//PATCH /vehicles/:id/deactivate
vehicleRouter.patch("/:id/deactivate", vehiclesController.deactivate)

export default vehicleRouter