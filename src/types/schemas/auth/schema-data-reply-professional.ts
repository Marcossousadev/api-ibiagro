import {z} from 'zod';

export const schemaDataReplyProfessional = z.object({
    fullName: z.string(),
    email: z.string().email(),
    imageUrl: z.string().base64(),
    age: z.number().int().positive(),
    role: z.literal('PROFESSIONAL'),
    typeProfessional: z.string(),
    createdAt: z.date()
})  