import z from 'zod';
export const schemaAcceptStudentCompany = z.object({
    studentId: z.string(),
    code: z.string().length(6, 'Código de apenas 6 digitos!')
});