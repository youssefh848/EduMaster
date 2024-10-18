import path from 'path'
import express from 'express'
import dotenv from "dotenv";
import { dbConnection } from './db/connection.js'
const app = express()
const port = process.env.PORT || 3000;
dotenv.config({ path: path.resolve("./config/.env") })
// db connection
dbConnection()


app.listen(port, () => console.log(`app listening on port ${port}!`))