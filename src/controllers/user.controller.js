import UserModel from "../models/User.models.js";
import sendEmail from "../utils/email.js";


// post : /api/user/signup
async function signup(req, res) {
    const { firstName, lastName, email, password, gender, dateOfBirth } = req.body
    if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !gender ||
        !dateOfBirth
    ) {
        return res.status(404).json({
            message: "All fields must be required !!!"
        })
    }

    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const resp = await UserModel.create({ firstName, lastName, email, password, gender, dateOfBirth, emailVerificationCode })
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
            message: "User created sucessfully and confirmation email is send !!!",
            resp
        })

    } catch (error) {
        if (error.code === 11000) {
            console.log("in 11000 error code")
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

// post:/api/user/signin
async function signin(req, res) {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "All Fields required !!!"
            })
        }

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return res.status(404).json({
                message: "No User Found !!!"
            })
        }

        if (user.password != password) {
            return res.status(400).json({
                message: "You Entered Wrong Password !!!"
            })
        }

        return res.status(200).json({
            message: "User Sign In Successfully !!!",
            user
        })

    } catch (error) {
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
            message: "Verification Code Sent Sucessfully to your Email !!!"
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
        console.log("req.body", req.body)

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


// get: /api/user/verificationbyemail
async function verificationByEmail(req, res) {
    try {
        const { email } = req.params

        if (!email) {
            return res.status(400).json({
                message: "Email must be required !!!"
            })
        }

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return res.status(404).json({
                message: "No User Found With This Email !!!"
            })
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                message: "Email Is Already Verified !!!"
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
            message: "Verification Code Sent Sucessfully to your Email !!!",
            id: user._id
        })

    } catch (error) {
        return res.status(500).json({
            message: "An Unexpected error occured !!!",
            error: error.message
        })
    }
}

//get: /api/user/sendresetlink/:email
async function sendResetLink(req, res) {
    try {

        const { email } = req.params

        if (!email) {
            return res.status(400).json({
                message: "Email must be required !!!"
            })
        }

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return res.status(404).json({
                message: "No User Found With This Email !!!"
            })
        }

        const emailRes = await sendEmail(email, '', 'reset', user._id)

        if (!emailRes) {
            return res.status(500).json({
                message: "Enable to send reset password link,Try again !!"
            })
        }

        return res.status(200).json({
            message: "Check Your Email To Reset Password !!!"
        })

    } catch (error) {
        return res.status(500).json({
            message: "An Unexpected error occured !!!",
            error: error.message
        })
    }
}

// put: /api/user/resetpassword
async function resetPassword(req, res) {
    try {

        const { userId, password, confirmPassword } = req.body

        if (!userId || !password || !confirmPassword) {
            return res.status(400).json({
                message: "UserId ,password and confirmPassword must be required !!!"
            })
        }

        const user = await UserModel.findById({ _id: userId })

        if (!user) {
            return res.status(404).json({
                message: "No User Found !!!"
            })
        }

        user.password = password

        await user.save()

        return res.status(200).json({
            message: "Password Changes Successfully !!!"
        })

    } catch (error) {
        return res.status(500).json({
            message: "An Unexpected error occured !!!",
            error: error.message
        })
    }
}


export default {
    signup,
    signin,
    sendEmailVerification,
    verifyEmail,
    verificationByEmail,
    sendResetLink,
    resetPassword
}