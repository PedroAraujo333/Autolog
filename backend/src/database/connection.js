import dotenv from "dotenv"
import pkg from "pg"

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function query(queryString, params, callback) {
    return pool.query(queryString, params, callback)
}

export async function getClient(){
    return pool.connect()
}

