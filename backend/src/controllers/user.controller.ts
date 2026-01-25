import type { Request, Response } from "express";
import {User} from "../models/user.models.js";

const registerUser = async (req: Request, res: Response) => {
    const {name, password}=  req.body

    if(!name || !password){
        res.status(400).json({ message: "Both username and password are required!"})
        return;
    }

    const existedUser = await User.findOne({
        name
    })

    if(existedUser){
        res.status(409).json({ message: "Account with same username already exits." })
        return;
    }

    const user = await User.create({
        name: name.toLowerCase(),
        password
    })

    res.status(201).json(user);
}

const loginUser = async (req: Request, res: Response) => {
    const { name, password } = req.body;

    if(!name || !password){
        res.status(400).json({ message: "Both name and password is required!" })
        return;
    }

    const user = await User.findOne(name);

    if(!user){
        res.status(404).json({ message: "User not found!"})
    }

    if(user?.password !== password){
        res.status(401).json({ message: "User credentials invalid!!"})
    }

    return res
    .status(201)
    .json({ message: "User logged in successfully", user})
}

export {
    registerUser,
    loginUser
}