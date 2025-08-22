import {z} from 'zod';

export const schemaDataReplyStudent = z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    email: z.string().email(),
    age: z.number().int().positive(),
    role: z.literal('STUDENT'),
    createdAt: z.date(),
});