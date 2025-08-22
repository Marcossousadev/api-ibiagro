import {z}  from 'zod';

export const baseSchema = {
    id: z.string().uuid().optional(),
    imageUrl: z.string(),
    email: z.string().email("Deve ser um email válido!"),
    password: z.string().min(6, "Mínimo 6 caracteres!"),
    createdAt: z.date().optional(),
    updateAt: z.date().optional(),
    role: z.enum(['COMPANY', 'CLIENT']),
};  