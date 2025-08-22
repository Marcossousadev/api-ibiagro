import {z} from 'zod';

export const schemaSignInClient = z.object({
    email: z.string().email('Email válido, por favor!'),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});