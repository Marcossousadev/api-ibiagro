import {z} from 'zod';

export const schemaResendCodeEmail = z.object({
    email: z.string().email(),
    role: z.enum(['company', 'client'])
});