import { query } from "../database/connection.js"
import Vehicle from "./Vehicle.js"


export default class Maintenance{
    constructor(maintenanceRow, populateVehicle){
        this.id = maintenanceRow.id
        this.vehicleId = maintenanceRow.vehicle_id
        this.maintenanceType = maintenanceRow.maintenance_type
        this.description = maintenanceRow.description
        this.cost = +maintenanceRow.cost
        this.maintenanceDate = maintenanceRow.maintenance_date
        this.kmAtMaintenance = maintenanceRow.km_at_maintenance
        this.workshopName = maintenanceRow.workshop_name
        this.createdAt = new Date(maintenanceRow.created_at)
        this.updatedAt = new Date(maintenanceRow.updated_at)
        
        this.vehicle = undefined
        if(populateVehicle){
            this.vehicle = populateVehicle
        }
    }

    static async findAll(){
        const result = await query(`
            SELECT
            maintenances.*,
            vehicles.id AS "vehicle.id",
            vehicles.license_plate AS "vehicle.license_plate",
            vehicles.brand AS "vehicle.brand",
            vehicles.model AS "vehicle.model",
            vehicles.current_km AS "vehicle.current_km",
            vehicles.status AS "vehicle.status",
            vehicles.created_at AS "vehicle.created_at", 
            vehicles.updated_at AS "vehicle.updated_at"
            FROM maintenances JOIN vehicles ON vehicles.id = maintenances.vehicle_id;
            `)//tem necessidade de eu pegar o created e o updated do vehicles aqui? pq?
         return result.rows.map((row) => {
            const vehicle = {
               id: row["vehicle.id"],
               licensePlate: row["vehicle.license_plate"],
               brand: row["vehicle.brand"],
               model: row["vehicle.model"],
               currentKm: row["vehicle.current_km"],
               status: row["vehicle.status"]
        }
        return new Maintenance(row, vehicle)
    })

    }
    static async findById(id){
        const result = await query(`
            SELECT
            maintenances.*,
            vehicles.id AS "vehicle.id",
            vehicles.license_plate AS "vehicle.license_plate",
            vehicles.brand AS "vehicle.brand",
            vehicles.model AS "vehicle.model",
            vehicles.current_km AS "vehicle.current_km",
            vehicles.status AS "vehicle.status",
            vehicles.created_at AS "vehicle.created_at", 
            vehicles.updated_at AS "vehicle.updated_at"
            FROM maintenances JOIN vehicles ON vehicles.id = maintenances.vehicle_id
            WHERE maintenances.id = $1;
            `, [id]
        )
        
        const maintenanceData = result.rows[0]
        
        if(!result.rows[0]) return null

        const vehicle = {
               id: maintenanceData["vehicle.id"],
               licensePlate: maintenanceData["vehicle.license_plate"],
               brand: maintenanceData["vehicle.brand"],
               model: maintenanceData["vehicle.model"],
               currentKm: maintenanceData["vehicle.current_km"],
               status: maintenanceData["vehicle.status"]
        }
        
        
        return new Maintenance(maintenanceData, vehicle)
    }
    static async create(vehicleId, maintenanceType, description, cost, maintenanceDate, kmAtMaintenance, workshopName ){
        const vehicle = await Vehicle.findById(vehicleId)
        if(!vehicle) return null
        const result = await query(
            `INSERT INTO maintenances (vehicle_id, maintenance_type, description, cost, maintenance_date, km_at_maintenance, workshop_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;`,
            [vehicleId, maintenanceType, description, cost, maintenanceDate, kmAtMaintenance, workshopName]
        )
        return new Maintenance(result.rows[0])

    }
    static async update(id, attributes){
        const maintenance = await Maintenance.findById(id)
        if (!maintenance) return null

        
        const { maintenanceType, description, cost, maintenanceDate, kmAtMaintenance, workshopName } = attributes

        maintenance.maintenanceType = maintenanceType ?? maintenance.maintenanceType
        maintenance.description = description ?? maintenance.description
        maintenance.cost = cost ?? maintenance.cost
        maintenance.maintenanceDate = maintenanceDate ?? maintenance.maintenanceDate
        maintenance.kmAtMaintenance = kmAtMaintenance ?? maintenance.kmAtMaintenance
        maintenance.workshopName = workshopName ?? maintenance.workshopName
        maintenance.updatedAt = new Date()

        await query(
            `
                UPDATE maintenances SET
                maintenance_type = $1,
                description = $2,
                cost = $3,
                maintenance_date = $4,
                km_at_maintenance = $5,
                workshop_name = $6,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = $7;
            `,
            [
                maintenance.maintenanceType,
                maintenance.description,
                maintenance.cost,
                maintenance.maintenanceDate,
                maintenance.kmAtMaintenance,
                maintenance.workshopName,
                maintenance.id
            ]
        )
            return maintenance
    }
    static async findByVehicleId(vehicleId){
        const vehicle = await Vehicle.findById(vehicleId)
        if(!vehicle) return null

        const result = await query(
            `
            SELECT
            maintenances.*,
            vehicles.id AS "vehicle.id",
            vehicles.license_plate AS "vehicle.license_plate",
            vehicles.brand AS "vehicle.brand",
            vehicles.model AS "vehicle.model",
            vehicles.current_km AS "vehicle.current_km",
            vehicles.status AS "vehicle.status"
            FROM maintenances JOIN vehicles ON vehicles.id = maintenances.vehicle_id
            WHERE vehicle_id = $1;
            `, [vehicleId]
        )

         return result.rows.map((row) => {
            const vehicle = {
               id: row["vehicle.id"],
               licensePlate: row["vehicle.license_plate"],
               brand: row["vehicle.brand"],
               model: row["vehicle.model"],
               currentKm: row["vehicle.current_km"],
               status: row["vehicle.status"]
        }
        return new Maintenance(row, vehicle)
        })
    }


    static async delete(id){
        const maintenance = await Maintenance.findById(id)
        if(!maintenance) return null

        await query(`DELETE FROM maintenances WHERE id = $1`, [id])
        return true
}
}
