import { FastifyTypeInstance } from "../../../types/type-fastify";
import { schemaZodFlattenError } from "../../../types/schemas/auth/schema-zod-flatten-error";
import { schemaInviteStudent } from "../../../types/schemas/company/schema-invite-student-company";
import { schemaInviteProfessionalCompany } from '../../../types/schemas/company/schema-invite-professional-company';
import {  controllerInviteUnionCodeProfessional, controllerResendInviteProfessional } from '../../../controllers/users/company/invites/invite-company-to-professional-controller';
import { schemaInviteNotAcceptedStudents } from "../../../types/schemas/company/schema-invite-not-accepted-students";
import {
    controllerInviteUnionCodeStudent,
    controllerResendInvite
} from '../../../controllers/users/company/invites/invite-company-to-student-controller';
import { controllerInviteNotAcceptedStudents } from '../../../controllers/users/company/invites/data-invites-students-controller';
import { controllerDataInvitesProfessionalsNotAccepted } from '../../../controllers/users/company/invites/data-invites-professionals-controller';
import { controllerSearchDataCompany } from '../../../controllers/users/company/search-data-company-controller';
import {z} from 'zod';
export async function routesCompany(app: FastifyTypeInstance){
    app.post('/send-invite', {
        schema:{
            tags:['company'],
            description:"Invite code to student",
            body: schemaInviteStudent,
            response:{
                200: z.object({message: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                409:z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerInviteUnionCodeStudent);

    app.post('/send-invite-professional', {
         schema:{
            tags:['company'],
            description:"Invite code to professional",
            body: schemaInviteProfessionalCompany,
            response:{
                200: z.object({message: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                409:z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerInviteUnionCodeProfessional);

    app.post('/resend-invite', {
        schema:{
            tags:['company'],
            description:"Resend code to Student",
            body:schemaInviteStudent,
            response:{
                200: z.object({message: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerResendInvite);

    app.post('/resend-invite-professional', {
        schema:{
            tags:['company'],
            description:"Resend code to Professional",
            body:schemaInviteProfessionalCompany,
            response:{
                200: z.object({message: z.string()}),
                400: z.object({error: schemaZodFlattenError}),
                401: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerResendInviteProfessional);  

    app.get('/invites-pending', {
        schema:{
            tags:['company'],
            description:"Get invites-pending-students",
            querystring: z.object({
                companyId: z.string()
            }),
            response:{
                200: z.object({invites:z.array(z.any())}),
                401: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerInviteNotAcceptedStudents);


    app.get('/invites-pending-professional', {
        schema:{
            tags:['company'],
            description:'Get invites-pending-professional',
            querystring: z.object({
                companyId: z.string()
            }),
            response:{
                200: z.object({invites: z.array(z.any())}),
                401: z.object({message: z.string()}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerDataInvitesProfessionalsNotAccepted);


    app.get('/search-data-company', {
        schema:{
            tags:['company'],
            description:"Search data company",
            querystring: z.object({
                id: z.string()
            }),
            response:{
                200: z.object({company: z.object({}).catchall(z.any())}),
                400: z.object({error: schemaZodFlattenError}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        }
    }, controllerSearchDataCompany);
}