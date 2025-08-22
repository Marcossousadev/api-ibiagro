import { FastifyTypeInstance } from '../../../types/type-fastify';
import {controllerAcceptInviteCompanyProfessional} from '../../../controllers/users/professional/receipt-professional-company-controller';
import { controllerSearchDataProfessional } from '../../../controllers/users/professional/search-data-professional-controller';
import {schemaAcceptProfessionalCompany} from '../../../types/schemas/professional/schema-accept-professional-company';
import {schemaZodFlattenError} from '../../../types/schemas/auth/schema-zod-flatten-error';
import {schemaInviteStudentByProfessional} from '../../../types/schemas/professional/schema-invite-student-by-professional';
import { controllerInviteUnionCodeStudent, controllerResendInviteStudent } from '../../../controllers/users/professional/invites/invite-professional-to-student-controller';
import { controllerInviteNotAcceptedStudentsByProfessional } from '../../../controllers/users/professional/invites/data-invites-students-controller';
import {z} from 'zod';
export async function routesProfessional(app: FastifyTypeInstance){
    app.post('/accept-invite-company', {
        schema:{
                    tags:['professional'],
                    description:"Accept invite company",
                    body: schemaAcceptProfessionalCompany,
                    response:{
                        200: z.object({message: z.string()}),
                        400: z.object({error: schemaZodFlattenError}),
                        401: z.object({message: z.string()}),
                        409: z.object({message: z.string()}),
                        500: z.object({error: z.string()})
                    }
                }
    }, controllerAcceptInviteCompanyProfessional);


    app.get('/search-data-professional', {
        schema:{
            tags:['professional'],
            description:"Search data professional",
            querystring: z.object({
                id: z.string()
            }),
            response:{
                200: z.object({professional: z.object({}).catchall(z.any())}),
                400: z.object({error: schemaZodFlattenError}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerSearchDataProfessional);

        app.post('/send-invite-student-professional', {
            schema:{
                tags:['professional'],
                description:"Invite code to student",
                body: schemaInviteStudentByProfessional,
                response:{
                    200: z.object({message: z.string()}),
                    400: z.object({error: schemaZodFlattenError}),
                    401: z.object({message: z.string()}),
                    409:z.object({message: z.string()}),
                    500: z.object({error: z.string()})
                }
            }
        }, controllerInviteUnionCodeStudent);

        app.post('/resend-invite-student-professional', {
                schema:{
                    tags:['professional'],
                    description:"Resend code to Student",
                    body:schemaInviteStudentByProfessional,
                    response:{
                        200: z.object({message: z.string()}),
                        400: z.object({error: schemaZodFlattenError}),
                        401: z.object({message: z.string()}),
                        409: z.object({message: z.string()}),
                        500: z.object({error: z.string()})
                    }
                }
            }, controllerResendInviteStudent);


            app.get('/invites-pending', {
                    schema:{
                        tags:['professional'],
                        description:"Get invites-pending-students",
                        querystring: z.object({
                            professionalId: z.string()
                        }),
                        response:{
                            200: z.object({invites:z.array(z.any())}),
                            401: z.object({message: z.string()}),
                            409: z.object({message: z.string()}),
                            500: z.object({error: z.string()})
                        }
                    }
                }, controllerInviteNotAcceptedStudentsByProfessional);
}