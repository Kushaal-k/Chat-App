import type { Request, Response } from "express";
import { User } from "../models/user.models.js";

const registerUser = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.status(400).json({
			message: "Both username and password are required!",
		});
		return;
	}

	const existedUser = await User.findOne({
		username,
	});

	if (existedUser) {
		res.status(409).json({
			message: "Account with same username already exits.",
		});
		return;
	}

	const user = await User.create({
		username: username.toLowerCase(),
		password,
	});

	return res.status(201).json(user);
};

const loginUser = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.status(400).json({
			message: "Both username and password is required!",
		});
		return;
	}

	const user = await User.findOne({ username });

	if (!user) {
		res.status(404).json({ message: "User not found!" });
		return;
	}

	if (user?.password !== password) {
		res.status(401).json({ message: "User credentials invalid!!" });
		return;
	}

	return res
		.status(201)
		.json({ message: "User logged in successfully", user });
};

const getAllUser = async (req: Request, res: Response) => {
	try {
		const users = await User.find().select("-password");

		res.status(200).json({
			success: true,
			count: users.length,
			users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch users",
		});
	}
};

export { registerUser, loginUser, getAllUser };
