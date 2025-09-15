import { FastifyInstance } from "fastify/types/instance";
import z from 'zod';
import { schemaZodFlattenError } from "../../../types/schemas/auth/schema-zod-flatten-error";
import { controllerSearchDataClient } from "../../../controllers/users/search-data-client";
export async function routesClient(app: FastifyInstance){
    app.get('/search-data-client', {
        schema:{
            tags:['client'],
            description:"Search data client",
            querystring: z.object({
                id: z.string()
            }),
            response:{
                200: z.object({student: z.object({}).catchall(z.any())}),
                400: z.object({error: schemaZodFlattenError}),
                409: z.object({message: z.string()}),
                500: z.object({error: z.string()})
            }
        },
    }, controllerSearchDataClient);
}