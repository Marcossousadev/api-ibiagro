import z from 'zod';
export const schemaAcceptProfessionalCompany = z.object({
    professionalId: z.string(),
    code: z.string().length(6, 'Código de apenas 6 digitos!')
});