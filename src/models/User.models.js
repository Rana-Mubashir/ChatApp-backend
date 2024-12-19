import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        unique: true
    },
    lastName: {
        type: String,
        unique: true,
    },
    bio: {
        type: String,
    },
    userImage: {
        type: String
    },
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    }
},
    {
        timestamps: true
    }
)

userSchema.index({ firstName: 1, lastName: 1 }, { unique: true })

const UserModel = model('UserModel', userSchema)

export default UserModel

