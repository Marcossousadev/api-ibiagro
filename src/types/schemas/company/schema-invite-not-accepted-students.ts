import z from 'zod';

export const schemaInviteNotAcceptedStudents = z.object({
    companyId: z.string()
})