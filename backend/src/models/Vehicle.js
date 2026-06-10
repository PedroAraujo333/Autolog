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
    this.createdAt = new Date(vehicleRow.created_at)
    this.updatedAt = new Date(vehicleRow.updated_at)
  }
  //metodos CRUD
  static async findAll(){
    const result = await query("SELECT * FROM vehicles;")
    return result.rows.map((row) => new Vehicle(row))
  }



}

