import { Router } from "express";
import userController from "../controllers/user.controller.js";
const userRouter = Router()

userRouter.post('/signup', userController.signup)
userRouter.post('/signin', userController.signin)
userRouter.get('/sendemailverification/:userId', userController.sendEmailVerification)
userRouter.put('/verifyemail', userController.verifyEmail)
userRouter.get('/verificationbyemail/:email', userController.verificationByEmail)
userRouter.get('/sendresetlink/:email', userController.sendResetLink)
userRouter.put('/resetpassword', userController.resetPassword)
userRouter.get('/all/:id',userController.getAllUsers)

export { userRouter }