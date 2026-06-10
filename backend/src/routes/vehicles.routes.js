import { Router } from "express"
import vehiclesController from "../controllers/vehicles.controller.js"

const vehicleRouter = Router()

//GET /vehicles
vehicleRouter.get("/", vehiclesController.index);


export default vehicleRouter