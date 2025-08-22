import {z} from 'zod';
import {baseSchema} from '../../../types/schemas/auth/base-schema-user';
const rexegCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
export const schemaCompany = z.object({
    ...baseSchema,
    companyName: z.string(),
    cnpj: z.string(),
    nameResponse: z.string(),
    phoneCompany: z.string(),
    stay: z.string(),
    city: z.string(),
    role: z.literal('COMPANY')
})