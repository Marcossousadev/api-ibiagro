import { z } from 'zod';

export const schemaInviteStudentByProfessional = z.object({
  professionalId: z.string().uuid(),
  email: z.string().email(),
});
