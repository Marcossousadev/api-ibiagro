import type { FastifyTypeInstance } from "../../../types/type-fastify";
import { controllerAcceptInviteCompany } from '../../../controllers/users/student/receipt-invites/receipt-student-company-controller';
import {controllerSearchDataStudent} from '../../../controllers/users/student/search-data-student-controller';
import {schemaAcceptStudentCompany} from '../../../types/schemas/student/schema-accept-student-company';
import {schemaZodFlattenError} from '../../../types/schemas/auth/schema-zod-flatten-error';
import {schemaAcceptStudentProfessional} from '../../../types/schemas/student/schema-accept-student-professional';
import {controllerAcceptInviteProfessional} from '../../../controllers/users/student/receipt-invites/receipt-student-professional-controller';
import {z} from 'zod';
export async function routesStudent(app: FastifyTypeInstance){
    app.post('/accept-invite-company', {
        schema:{
            tags:['student'],
            description:"Accept invite company",
            body: schemaAcceptStudentCompany,
            response:{
                200: z.object({message: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        },
    }, controllerAcceptInviteCompany);

    app.post('/accept-invite-professional', {
        schema:{
            tags:['student'],
            description:"Accept invite professional",
            body: schemaAcceptStudentProfessional,
            response:{
                200: z.object({message: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        },
    }, controllerAcceptInviteProfessional);

    app.get('/search-data-student', {
        schema:{
            tags:['student'],
            description:"Search data student",
            querystring: z.object({
                    id: z.string()
                }),
            response:{
                200: z.object({student: z.object({}).catchall(z.any())}),
                400: z.object({error: schemaZodFlattenError}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerSearchDataStudent);
}