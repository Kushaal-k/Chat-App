import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../utils/env.js"

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            index: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String, // Link from cloudinary
            required: true,
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true,
    },
);

userSchema.pre("save", async function (next: any) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        } as SignOptions
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        } as SignOptions
    )
}

export const User = model("User", userSchema);