import { FastifyInstance } from "fastify/types/instance";
import {z} from 'zod';
import { schemaZodFlattenError } from "../../../types/schemas/auth/schema-zod-flatten-error";
import { controllerSearchDataCompany } from "../../../controllers/users/search-data-company";
export async function routesCompany(app: FastifyInstance){
    app.get("/search-data-company", {
        schema:{
            tags:['company'],
            description:"Search data company",
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
    }, controllerSearchDataCompany);
}