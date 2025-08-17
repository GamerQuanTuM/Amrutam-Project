import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.config";

interface AuthenticatedUser extends Request {
    user?: {
        email: string,
        id: string,
        role: "ADMIN" | "USER" | "DOCTOR"
    }
}

export const authenticated = (
    req: AuthenticatedUser,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as {
            id: string;
            email: string;
            role: "ADMIN" | "USER" | "DOCTOR";
        };
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
