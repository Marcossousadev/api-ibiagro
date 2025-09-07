import { FastifyTypeInstance } from "../../types/type-fastify";
import {
    controllerAuthSignUpCompany, 
    controllerAuthSignInCompany, 
    controllerAuthDecodeJwtCompany,
    controllerVerifyToken,
    controllerAuthSignUpCompanyImg
} from '../../controllers/auth/auth-company-controller';
import { schemaAuthDecodeCompany } from '../../types/schemas/auth/decode-jwt/schema-auth-decode-company';
import {schemaCompany} from '../../types/schemas/auth/company-schema';
import { schemaSignInCompany } from '../../types/schemas/auth/schema-sigin-company';
import {schemaDataReplyCompany} from '../../types/schemas/auth/schema-data-reply-company';
import {schemaZodFlattenError} from '../../types/schemas/auth/schema-zod-flatten-error';
import {schemaHeaders} from '../../types/schemas/auth/schema-headers';
import {z} from 'zod';
export async function routesAuthCompany(app: FastifyTypeInstance){
    app.post('/signUp-company', {
        schema:{
            tags:['company'],
            description:"Create new company",
            body: schemaCompany,
            response:{
                201: z.object({message: z.string(), timeExpiresVerificationEmail: z.date()}),
                400: z.object({error:schemaZodFlattenError}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerAuthSignUpCompany);

    app.post('/signUp-company-img', {
        schema:{
            tags:['company'],
            description:"Create new company",
            body: schemaCompany,
            response:{
                201: z.object({message: z.string(), timeExpiresVerificationEmail: z.date()}),
                400: z.object({error:schemaZodFlattenError}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerAuthSignUpCompanyImg);

    app.post('/signIn-company', {
        schema:{
            tags:['company'],
            description:"SignIn Company",
            body: schemaSignInCompany,
            response:{
                200: z.object({message: z.string(), token: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerAuthSignInCompany);
    
    app.post('/decode-jwtCompany', {
        schema:{
            tags:['company'],
            description:"Decode Jwt Company",
            body: schemaAuthDecodeCompany,
            response:{
                200: z.object({jwtDecode: z.any()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerAuthDecodeJwtCompany);

    app.get('/verify-token',{schema:{
        tags:['company'],
        description:"Is valid or not the Jwt",
        headers:schemaHeaders,
        response:{
            200: z.object({message: z.string(), valid: z.literal(true)}),
            401: z.object({message: z.string(), valid: z.literal(false)}),
            500: z.object({error: z.string()})
        }
    }} , controllerVerifyToken);
}