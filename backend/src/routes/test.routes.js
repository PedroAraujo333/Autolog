import { Router } from "express"
import { query } from "../database/connection.js"

const testRoutes = Router()

testRoutes.get("/test-db", async (req, res) => {
    const result = await query("SELECT * FROM maintenances;")
    res.json(result.rows)
  })

export default testRoutes