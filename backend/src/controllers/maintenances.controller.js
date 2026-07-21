import Maintenance from "./../models/Maintenances.js"
import Vehicle from "../models/Vehicle.js"

const validMaintenanceTypes = ["preventiva", "corretiva"]

const maintenanceController = {
    index: async (req, res, next) =>{
        try{
        const maintenances = await Maintenance.findAll()
        res.json(maintenances)
        } catch(error) {
            next(error)
        }
    },
    show: async (req, res, next) => {
        try{
        const maintenance = await Maintenance.findById(req.params.id)
        if(maintenance === null) return res.status(404).json({message: "Manutenção não encontrada."})
        res.json(maintenance)
    } catch(error){
        next(error)
    }
    },
    create: async (req, res, next) =>{
        try{
        const vehicleId = req.params.id
        const vehicle = await Vehicle.findById(vehicleId)
        if(vehicle === null){
            return res.status(404).json({message: "Veículo não encontrado."})
        }
        const {maintenanceType, description, cost, maintenanceDate, kmAtMaintenance, workshopName} = req.body
        if(!maintenanceType || !description || cost === undefined || !maintenanceDate || kmAtMaintenance === undefined || !workshopName){
            return res.status(400).json({ message: "É obrigatório inserir os dados solicitados."})
        } if(cost <= 0){
            return res.status(400).json({ message: "O preço da manutenção precisa ser maior que 0."})
        } if(!validMaintenanceTypes.includes(maintenanceType)){
            return res.status(400).json({message: "Tipo de manutenção inválida."})
        } if(kmAtMaintenance <= 0){
            return res.status(400).json({message: "A quilometragem precisa ser maior que 0."})
        } if(kmAtMaintenance < vehicle.currentKm){
            return res.status(400).json({message: "A quilometragem da manutenção precisa ser maior que a última registrada no veículo."})
        }

        const newMaintenance = await Maintenance.create(vehicleId, maintenanceType, description, cost, maintenanceDate, kmAtMaintenance, workshopName)
        if(newMaintenance === null) return res.status(404).json({ message: "Veículo não encontrado." })
        res.status(201).json(newMaintenance)
        } catch(error){
            next(error)
        }
    },
    update: async (req, res, next) =>{
        try{
            const id = Number(req.params.id)
            if(req.body.maintenanceType !== undefined && !validMaintenanceTypes.includes(req.body.maintenanceType)){
                return res.status(400).json({message: "Tipo de manutenção inválida."})
            } if(req.body.cost !== undefined && req.body.cost <= 0){
                return res.status(400).json({ message: "O preço da manutenção precisa ser maior que 0."})
            } if(req.body.kmAtMaintenance !== undefined && req.body.kmAtMaintenance <= 0){
                return res.status(400).json({message: "A quilometragem precisa ser maior que 0."})
            } 

            const updatedMaintenance = await Maintenance.update(id, req.body)
            if (updatedMaintenance === null) {
                return res.status(404).json({ message: "Manutenção não encontrada."})
            } if (updatedMaintenance === false){
                return res.status(400).json({message: "A quilometragem da manutenção não pode ser maior que a atual do veículo."})
            }

            res.status(200).json(updatedMaintenance)
        } catch(error){
            next(error)
        }
    },
    indexByVehicle: async (req, res, next) =>{
        try{
            const vehicleId = Number(req.params.id) 
            const maintenances = await Maintenance.findByVehicleId(vehicleId)
            if(maintenances === null) return res.status(404).json({ message: "Veículo não encontrado." })
            if(maintenances.length === 0) return res.status(200).json({ message: "Este veículo não possui manutenções registradas." })
            res.json(maintenances)
        } catch(error){
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try{
        const result = await Maintenance.delete(req.params.id)
        if(result === null) {
            return res.status(404).json({ message: "Manutenção não encontrada." })
        }
            res.status(200).json({message: "Manutenção apagada com sucesso."})
        } catch(error){
            next(error)
        }
    }
}

export default maintenanceController