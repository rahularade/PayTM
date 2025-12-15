import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Missing or invalid Authorization header",
        });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(401).json({
                message: "Invalid or expired token",
            });
        }
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export default auth;
