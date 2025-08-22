import {z} from 'zod';

export const schemaInviteStudent = z.object({
    email: z.string().email('Passe um email válido!'),
    companyId: z.string(),
});