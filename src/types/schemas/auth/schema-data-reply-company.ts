import {z} from 'zod';
export const schemaDataReplyCompany = z.object({
    id: z.string().uuid().optional(),
    companyName: z.string(),
    email: z.string().email(),
    role: z.literal('COMPANY'),
    createdAt: z.date()
})