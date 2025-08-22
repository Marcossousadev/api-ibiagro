import z from 'zod';


export const schemaAuthDecodeProfessional = z.object({
    jwtProfessional: z.string()
});