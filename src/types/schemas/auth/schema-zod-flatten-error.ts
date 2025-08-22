import {z} from 'zod';

export const schemaZodFlattenError = z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.record(z.array(z.string()))
}); 