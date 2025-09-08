import { baseSchema } from './base-schema-user';
import { z } from 'zod';
export const clientSchema = z.object({
   ...baseSchema, 
    role: z.literal('CLIENT'),
    fullName: z.string().min(9, "No mínimo o nome deve conter 9 caracteres"),
    age: z.number().int().positive(),
    cpf: z.string().min(11, "O CPF deve conter 14 caracteres"),
    phone: z.string(),
    stay: z.string(),
    city: z.string()
});