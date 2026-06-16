import express from "express"
import vehicleRouter from "./routes/vehicles.routes.js"
import errorHandler from "./middlewares/errorHandler.js"

const app = express()

app.use(express.json())
app.use("/vehicles", vehicleRouter)


app.use(errorHandler)
export default app