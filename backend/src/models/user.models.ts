import mongoose, {model} from "mongoose"

const userSchema = new  mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required!"],
        }
    }, 
    {
        timestamps: true
    }
)

export const User = model("User", userSchema)