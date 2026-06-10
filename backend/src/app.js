import express from "express"
import testRoutes from"./routes/test.routes.js"
import vehicleRouter from "./routes/vehicles.routes.js"

const app = express()

app.use(express.json())
app.use("/vehicles", vehicleRouter)

export default app