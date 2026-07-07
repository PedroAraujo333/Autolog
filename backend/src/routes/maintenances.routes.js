import { Router } from "express"
import maintenanceController from "../controllers/maintenances.controller.js"

const maintenanceRouter = Router()

//GET /maintenances
maintenanceRouter.get("/", maintenanceController.index)

//GET /maintenances/:id
maintenanceRouter.get("/:id", maintenanceController.show)

//PUT /maintenances/:id
maintenanceRouter.put("/:id", maintenanceController.update)

//DELETE /maintenances/:id
maintenanceRouter.delete("/:id", maintenanceController.delete)

export default maintenanceRouter