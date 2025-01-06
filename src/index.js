import express from 'express'
import dotenv from 'dotenv'
import connectDb from './db/db.js'
import { userRouter } from './routes/user.routes.js'
import stripeRouter from './routes/stripe.routes.js'
import session from 'express-session'
import passport from 'passport'

const app = express()

dotenv.config({
    path: './env'
})

app.use(express.json({
    limit: "16Kb"
}))
app.use(express.urlencoded({
    limit: '16Kb'
}))

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

connectDb()
    .then(() => {
        app.listen(process.env.PORT, (req, res) => {
            console.log(`server is listening on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("error in connecting with database", error)
    })

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Server is listening at post 4049"
    })
})

app.use('/api/user', userRouter)

app.use('/api/payment', stripeRouter)