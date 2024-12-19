import express from 'express'
import dotenv from 'dotenv'
import connectDb from './db/db.js'

const app = express()

dotenv.config({
    path: './env'
})

connectDb()
    .then(() => {
        app.listen(process.env.PORT, (req, res) => {
            console.log(`server is listening on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("error in connecting with database",error)
    })

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Server is listening at post 4049"
    })
})