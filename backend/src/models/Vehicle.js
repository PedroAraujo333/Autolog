import { query } from "../database/connection.js"

export default class Vehicle {
  constructor(vehicleRow) {
    this.id = vehicleRow.id
    this.licensePlate = vehicleRow.license_plate
    this.brand = vehicleRow.brand
    this.model = vehicleRow.model
    this.year = +vehicleRow.year
    this.currentKm = vehicleRow.current_km
    this.status = vehicleRow.status
    this.isActive = vehicleRow.is_active
    this.createdAt = new Date(vehicleRow.created_at)
    this.updatedAt = new Date(vehicleRow.updated_at)
  }


  //metodos CRUD-----

  static async findAll(){
    const result = await query("SELECT * FROM vehicles WHERE is_active = true;")
    return result.rows.map((row) => new Vehicle(row))
  }
  static async findById(id){
    const result = await query(`SELECT * FROM vehicles WHERE id = $1`, [id])
    if(!result.rows[0]) return null
    return new Vehicle(result.rows[0])
  }
  static async create( licensePlate, brand, model, year, currentKm, status){
    const result = await query(
      `INSERT INTO vehicles (license_plate, brand, model, year, current_km, status, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`,
      [licensePlate, brand, model, year, currentKm, status, true]
    )
    return new Vehicle(result.rows[0])
  }
  static async update(id, attributes){
    const vehicle = await Vehicle.findById(id)
    if(!vehicle) return null

     const { licensePlate, brand, model, year, currentKm, status } = attributes

    vehicle.licensePlate = licensePlate ?? vehicle.licensePlate
    vehicle.brand = brand ?? vehicle.brand
    vehicle.model = model ?? vehicle.model
    vehicle.year = year ?? vehicle.year
    vehicle.currentKm = currentKm ?? vehicle.currentKm
    vehicle.status = status ?? vehicle.status
    vehicle.updatedAt = new Date()

    await query(
      `
      UPDATE vehicles SET
      license_plate = $1,
      brand = $2,
      model = $3,
      year = $4,
      current_km = $5,
      status = $6,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $7;
      `,
      [
        vehicle.licensePlate,
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        vehicle.currentKm,
        vehicle.status,
        vehicle.id
      ]
    )
    return vehicle
  }
  static async deactivate(id){
    const vehicle = await Vehicle.findById(id)
    if(!vehicle) return null

   const result = await query(
      `UPDATE vehicles SET
      is_active = false,
      status = 'unavailable',
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;`,
    [id] 
    )

    return new Vehicle(result.rows[0])
  }
  static async activate(id){
    const vehicle = await Vehicle.findById(id)
    if(!vehicle) return null

   const result = await query(
      `UPDATE vehicles SET
      is_active = true,
      status = 'available',
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;`,
    [id] 
    )

    return new Vehicle(result.rows[0])
  }
  static async delete(id){
    const vehicle = await Vehicle.findById(id)
    if(!vehicle) return null

    const maintenanceResult = await query(
      `SELECT 1 FROM maintenances WHERE vehicle_id = $1 LIMIT 1`, [id]
    )
    if(maintenanceResult.rows[0]) return false

    await query(`DELETE FROM vehicles WHERE id = $1`, [id])
    return true

  }

  
}
