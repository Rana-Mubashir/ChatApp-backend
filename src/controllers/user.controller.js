import UserModel from "../models/User.models.js";
import sendEmail from "../utils/email.js";


// post : /api/user/signup
async function signup(req, res) {
    console.log("req.body", req.body)
    const { firstName, lastName, email, password, bio, userImage, gender, dateOfBirth } = req.body
    if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !bio ||
        !userImage ||
        !gender ||
        !dateOfBirth
    ) {
        return res.status(404).json({
            message: "All fields must be required !!!"
        })
    }

    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const resp = await UserModel.create({ firstName, lastName, email, password, bio, userImage, gender, dateOfBirth, emailVerificationCode })
        if (!resp) {
            return res.status(500).json({
                message: "Something went wrong while creating the user !!!"
            })
        }

        const emailRes = await sendEmail(email, emailVerificationCode)

        if (!emailRes) {
            return res.status(500).json({
                message: "Enable to send verification email,Try again !!"
            })
        }

        return res.status(201).json({
            message: "User created sucessfully and confirmation email is sent !!!"
        })

    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern.firstName && error.keyPattern.lastName) {
                return res.status(400).json({
                    message: "A user with same first and last name already exists!!!"
                })
            }
            if (error.keyPattern.email) {
                return res.status(400).json({
                    message: "A user already registered with this email !!!"
                })
            }
        }
        return res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
}

// get:/api/user/sendemailverification/:userId
async function sendEmailVerification(req, res) {
    try {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).json({
                message: "User Id must  be required !!!"
            })
        }

        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "No User Found with this id"
            })
        }

        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.emailVerificationCode = emailVerificationCode

        await user.save()

        const emailRes = await sendEmail(user.email, emailVerificationCode)

        if (!emailRes) {
            return res.status(500).json({
                message: "Enable to send verification email,Try again !!"
            })
        }

        return res.status(200).json({
            message: "Verification Code Sent Sucessfully !!!"
        })

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occured !!!",
            error: error.message
        })
    }
}

// put: /api/user/verifyemail
async function verifyEmail(req, res) {
    try {

        const { userId, code } = req.body

        if (!userId || !code) {
            return res.status(400).json({
                message: "UserId and Verification Code required !!!"
            })
        }

        const user = await UserModel.findById(userId)

        if (!userId) {
            return res.status(404).json({
                message: "No user found !!!"
            })
        }

        if (user.emailVerificationCode === code) {

            user.isEmailVerified = true

            user.emailVerificationCode = null

            await user.save()

            return res.status(200).json({
                message: "Email Verified Sucessfully !!!"
            })
        }
        else {
            return res.status(400).json({
                message: "You Entered Invalid Verification Code !!!"
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: "An Unexpected error occured !!!",
            error: error.message
        })
    }
}


export default { signup, sendEmailVerification,verifyEmail }