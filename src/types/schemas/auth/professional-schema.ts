import {z} from 'zod';
import {baseSchema} from '../../../types/schemas/auth/base-schema-user';

const regexCref = /^\d{6}-[A-Z]\/[A-Z]{2}$/;
const regexCrnOne = /^\d{5}\/[A-Z]{2}$/;
const regexCrnTwo = /^\d{5}-\d{1}$/;
export const schemaProfessional = z.object({
    ...baseSchema,
    fullName: z.string().min(9, "No mínimo o nome deve conter 9 caracteres"),
    age: z.number().int().positive().gte(21, {message:"A idade deve ser no mínimo 23 anos."}),
    role: z.literal('PROFESSIONAL'),
    typeProfessional: z.enum(['TRAINER', 'NUTRITIONIST']),
    registrationNumber: z.string().refine((value) => {
        return regexCref.test(value) || regexCrnOne.test(value) || regexCrnTwo.test(value);
    }, {message:"Número de registro inválido!"}),
    autonomous: z.boolean()
}); 