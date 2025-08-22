import z from 'zod';

export const schemaAuthDecodeClient = z.object({
    jwtClient: z.string()
})