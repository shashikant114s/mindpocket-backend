import express, { type NextFunction, type Request, type Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { userModel } from "./db.js";
const JWT_SECRET = process.env.JWT_SECRET;


interface jwtTokenPayload extends Request {
    userName: string,
    userId: Object
}

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
    try {
        if (!JWT_SECRET) {
                console.error("❌ JWT_SECRET is undefined. Check your .env and dotenv.config()");
                process.exit(1);
            }
        const tokenVerification = jwt.verify(header, JWT_SECRET)
        console.log(tokenVerification)
        const userExists = await userModel.findOne({ userName: tokenVerification });
        if (!userExists) {
            return res.status(403).json({
                message: "Token Error or Server Error!"
            })
        }
        // @ts-ignore
        req.userId = userExists._id;
        // @ts-ignore
        req.userName = userExists.userName;

    } catch (error) {
        return res.json(
            { message: `Server Error ${error}` }
        )
    }

    next()
}