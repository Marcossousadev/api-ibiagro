import {FastifyInstance} from 'fastify';
import { controllerVerifyCode } from '../../../controllers/auth/mail/verify-code-email';
import { controllerResendCodeEmail } from '../../../controllers/auth/mail/resend-code-email';
import {schemaZodFlattenError} from '../../../types/schemas/auth/schema-zod-flatten-error';
import {schemaVerifyCodeEmail} from '../../../types/schemas/auth/mail/schema-verify-code-email';
import {schemaResendCodeEmail} from '../../..//types/schemas/auth/mail/schema-resend-code-email';
import {z} from 'zod';
export async function routesEmail(app:FastifyInstance){
    app.post('/verify-code', {
        schema:{
            tags:['email'],
            description:"Verify code email!",
            body:schemaVerifyCodeEmail,
            response:{
                200: z.object({message: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                404: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerVerifyCode);
    app.post('/resend-code', {
        schema:{
            tags:['email'],
            body:schemaResendCodeEmail,
            description:"Resend code Email User",
            response:{
                400: z.object({error:schemaZodFlattenError}),
                404: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                200: z.object({message: z.string(), timeExpiresVerificationEmail: z.date()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerResendCodeEmail);
}