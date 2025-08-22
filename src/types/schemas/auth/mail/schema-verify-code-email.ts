import {z} from 'zod';

export const schemaVerifyCodeEmail = z.object({
    email: z.string().email(),
    code: z.string().length(6, 'Código de apenas 6 dígitos.'),
    role: z.enum(['professional', 'company', 'student'])
});