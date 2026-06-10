import { json } from "express";
import Vehicle from "../models/Vehicle.js";

const vehiclesController = {
    index: async (req, res) =>{
        const vehicles = await Vehicle.findAll()
        res.json(vehicles)
    },
}

export default vehiclesController;