import { Router } from "express";
import userController from "../controllers/user.controller.js";
const userRouter=Router()

userRouter.post('/signup',userController.signup)
userRouter.get('/sendemailverification/:userId',userController.sendEmailVerification)
userRouter.put('/verifyemail',userController.verifyEmail)

export {userRouter}