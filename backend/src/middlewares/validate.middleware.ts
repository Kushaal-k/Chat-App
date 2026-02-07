import type { Request, Response, NextFunction } from "express";

export const validateCreateMessage = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { text, sender } = req.body;

    if(!text || typeof text != "string") {
        return res.status(400).json({ message: "Invalid message text" });
    }

    if(!sender || typeof sender != "string"){
        return res.status(400).json({ message: "Invalid sender" })
    }


    next();
}