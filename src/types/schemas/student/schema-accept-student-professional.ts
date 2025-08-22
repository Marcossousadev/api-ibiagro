import { z } from 'zod';

export const schemaAcceptStudentProfessional = z.object({
  code: z.string().min(6),
  studentId: z.string().uuid(),
});