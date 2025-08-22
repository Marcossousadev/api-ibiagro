import z from 'zod';

export const schemaInviteProfessionalCompany = z.object({
    email: z.string().email('Passe um email válido'),
    companyId: z.string()
});