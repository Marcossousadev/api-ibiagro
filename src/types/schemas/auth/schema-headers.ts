import z from 'zod';

export const schemaHeaders = z.object({
    authorization: z.string().startsWith('Bearer ').describe("JWT token")
})