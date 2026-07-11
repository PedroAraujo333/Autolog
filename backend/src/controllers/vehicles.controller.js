import Vehicle from "../models/Vehicle.js";

const validStatuses = ["available", "maintenance", "unavailable"]
const plateRegex = /^[A-Z]{3}\d([A-I]|\d)\d{2}$/

const vehiclesController = {
    index: async (req, res, next) =>{
        try {
            const vehicles = await Vehicle.findAll()
            res.json(vehicles)
        } catch(error){
            next(error)
        }
    },
    show: async (req, res, next) =>{
         try {
            const vehicle = await Vehicle.findById(req.params.id)
            if(vehicle === null) return res.status(404).json({message: "Veículo não encontrado."})
            res.json(vehicle)
         } catch(error){
            next(error)
         }
    },
    create: async (req, res, next) =>{
         try {
            
            const { licensePlate, brand, model, year, currentKm, status } = req.body
           
            if (!licensePlate || !brand || !model || currentKm === undefined) {
            return res.status(400).json({ message: "Inserir a placa, marca, modelo e quilometragem é necessário."})
            } 
            
            const fixedPlate = licensePlate.replace(/[\s-]/g, "").toUpperCase()
            

            if (fixedPlate.length !==7){
            return res.status(400).json({message: "A placa precisa ter 7 dígitos."})    
            } if(!plateRegex.test(fixedPlate)){
            return res.status(400).json({message: "Formato de placa inválido."})
            }
            if (currentKm < 0) {
            return res.status(400).json({ message: "A quilometragem não pode ser menor que 0."})
            } if (status !== undefined && !validStatuses.includes(status)){
                return res.status(400).json({message: "status inválido."})
            }
            const newVehicle = await Vehicle.create(fixedPlate, brand, model, year, currentKm, status)
            res.status(201).json(newVehicle)
         } catch(error){
            next(error)
         }
    },
    update: async (req, res, next) =>{
         try {
            if(req.body.currentKm !== undefined && req.body.currentKm < 0){
                return res.status(400).json({ message: "A quilometragem não pode ser menor que 0."})
            } if(req.body.licensePlate){
                
                const fixedPlate = req.body.licensePlate.replace(/[\s-]/g, "").toUpperCase()
                
                if(!plateRegex.test(fixedPlate)){
                    return res.status(400).json({ message: "Formato de placa inválido." })
                }
                req.body.licensePlate = fixedPlate
            } if(req.body.status !== undefined && !validStatuses.includes(req.body.status)){
                return res.status(400).json({ message: "Status inválido." })
            }
            const id = Number(req.params.id)
            const updatedVehicle = await Vehicle.update(id, req.body)
             if (updatedVehicle === null) return res.status(404).json({message: "Veículo não encontrado."})
            res.status(200).json(updatedVehicle)
         } catch(error){
            next(error)
         }
    },
    deactivate: async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const result = await Vehicle.deactivate(id)
             if (result === null) return res.status(404).json({ message: "Veículo não encontrado." })
            res.json(result)
        } catch (error) {
          next(error)
        }
    },
    activate: async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const result = await Vehicle.activate(id)
             if (result === null) return res.status(404).json({ message: "Veículo não encontrado." })
            res.json(result)
        } catch (error) {
          next(error)
        }
    },


    delete: async (req, res, next) =>{
        try{
            const id = Number(req.params.id)
            const result = await Vehicle.delete(id)
            if (result === null) return res.status(404).json({ message: "Veículo não encontrado." })
            if (result === false) return res.status(409).json({ message: "Veículo possui manutenções e não pode ser excluído."})
            res.status(200).json({ message: "Veículo excluído com sucesso." })
        } catch(error){
            next(error)
        }
    }
}

export default vehiclesController;