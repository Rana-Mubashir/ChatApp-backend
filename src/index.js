import express from 'express'
import dotenv from 'dotenv'
import connectDb from './db/db.js'
import { userRouter } from './routes/user.routes.js'
import stripeRouter from './routes/stripe.routes.js'
import { chatRouter } from './routes/chat.routes.js'
import session from 'express-session'
import passport from 'passport'
import http from 'http'
import { Server } from 'socket.io'

dotenv.config({ path: './env' })

const app = express()

app.use(express.json({ limit: "16Kb" }))
app.use(express.urlencoded({ limit: '16Kb' }))

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    console.log("User connected:", socket.id)

    socket.on('joinRoom', (chatId) => {
        socket.join(chatId)
        console.log(`User joined chat: ${chatId}`)
    })

    socket.on('sendMessage', ({ chatId, message,senderId }) => {
        console.log("send message in socket",message)
        io.to(chatId).emit('receiveMessage', {message,senderId})
    })
       
    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id)
    })
})

app.get('/', (req, res) => {
    return res.status(200).json({ message: "Server is listening at port 4049" })
})

app.use('/api/user', userRouter)
app.use('/api/payment', stripeRouter)
app.use('/api/v1/chat', chatRouter)

connectDb()
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("❌ Error in connecting to database", error)
    })
