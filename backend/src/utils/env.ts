import dotenv from "dotenv"
import type { Secret } from "jsonwebtoken"

dotenv.config()

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined")
}
if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined")
}
if (!process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error("ACCESS_TOKEN_EXPIRY is not defined")
}
if (!process.env.REFRESH_TOKEN_EXPIRY) {
    throw new Error("REFRESH_TOKEN_EXPIRY is not defined")
}

export const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
export const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY