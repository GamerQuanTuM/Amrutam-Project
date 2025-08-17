import { PrismaClient } from '../../prisma/src/prisma/generated/prisma'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query', 'error', 'warn', 'info'],
    })

// @ts-ignore
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
