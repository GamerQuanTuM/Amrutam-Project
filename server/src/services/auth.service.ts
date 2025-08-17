import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../config/prisma"
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../utils/httpException";
import env from "../config/env.config";

class AuthService {
    constructor() { }

    public async register({ email, name, password, role }: {
        email: string, name: string, password: string, role: "ADMIN" | "USER" | "DOCTOR"
    }) {
        const emailExists = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (emailExists) {
            throw new ConflictException("Email already exists");
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email, name, password: hashedPassword, role
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        return user;

    }
    public async login(email: string, password: string) {
        // 1️⃣ Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            env.JWT_SECRET,
            { expiresIn: "1d" }
        );


        const { password: _, ...userWithoutPassword } = user;

        return { ...userWithoutPassword, token };
    }

    public async currentUser(userId?: string, email?: string, appointments?: string) {
        if (!userId || !email) {
            throw new UnauthorizedException("Unauthorized");
        }

        if (!appointments) {
            throw new BadRequestException("Invalid query parameter")
        }

        // Convert string to boolean properly
        const includeAppointments = appointments === 'true';

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                email
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                appointments: includeAppointments
            }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        const transformedUser = {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        }

        return transformedUser;
    }
}

export default AuthService;
