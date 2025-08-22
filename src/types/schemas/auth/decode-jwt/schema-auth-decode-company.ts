import z from 'zod';
export const schemaAuthDecodeCompany = z.object({
    jwtCompany: z.string()
});