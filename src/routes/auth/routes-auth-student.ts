import { FastifyTypeInstance } from "../../types/type-fastify";
import {
    controllerAuthSignUpClient, 
    controllerAuthSigInClient, 
    controllerAuthDecodeJwtClient,
    controllerVerifyToken,
    controllerAuthSignUpClientImg
} from '../../controllers/auth/auth-client-controller';
import {schemaAuthDecodeClient} from '../../types/schemas/auth/decode-jwt/schema-auth-decode-client';
import {clientSchema} from '../../types/schemas/auth/client-schema';
import {schemaZodFlattenError} from '../../types/schemas/auth/schema-zod-flatten-error';
import {schemaDataReplyStudent} from '../../types/schemas/auth/schema-data-reply-student';
import {schemaSignInClient} from '../../types/schemas/auth/schema-signin-client';
import {schemaHeaders} from '../../types/schemas/auth/schema-headers';
import {z} from 'zod';
export async function routesAuthClient(app: FastifyTypeInstance){
    app.post('/signUp-client', {
       schema:{
        tags:['client'],
        description:'create new client',
        body: clientSchema,
        response:{
            201: z.object({message: z.string(), timeExpiresVerificationEmail: z.date()}),
            400: z.object({error: schemaZodFlattenError}),
            409: z.object({message: z.string()}),
            500: z.object({error: z.string()})
        }
        
     }}, controllerAuthSignUpClient);
       app.post('/signUp-client-img', {
       schema:{
        tags:['client'],
        description:'create new client',
        body: clientSchema,
        response:{
            201: z.object({message: z.string(), timeExpiresVerificationEmail: z.date()}),
            400: z.object({error: schemaZodFlattenError}),
            409: z.object({message: z.string()}),
            500: z.object({error: z.string()})
        }
        
     }}, controllerAuthSignUpClientImg);

    app.post('/signIn-client', {
        schema:{
            tags:['client'],
            description:"SignIn client",
            body: schemaSignInClient,
            response:{
                200: z.object({message: z.string(), token: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerAuthSigInClient);

    app.post('/decode-jwtClient', {
        schema:{
            tags:['client'],
            description:"Decode jwt Client",
            body: schemaAuthDecodeClient,
            response:{
                200 : z.object({jwtDecode: z.any()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerAuthDecodeJwtClient);

    app.get('/verify-token', {
        schema:{
            tags:['client'],
            description:"Jwt is valid or not",
            headers: schemaHeaders,
            response:{
                200: z.object({message: z.string(), valid: z.literal(true)}),
                401: z.object({message: z.string(), valid: z.literal(false)}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerVerifyToken);
}   