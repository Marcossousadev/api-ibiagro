import fp from 'fastify-plugin';
import {fastifySwagger} from '@fastify/swagger';
import {fastifySwaggerUi} from '@fastify/swagger-ui';
import {jsonSchemaTransform} from 'fastify-type-provider-zod'
import type {FastifyInstance} from 'fastify';
export default fp(async function swaggerConfig(app: FastifyInstance ) {
    app.register(fastifySwagger, {
        openapi:{
            info:{
                title:"Api FitPro",
                version:"1.0.0"
            }
        },
        transform: jsonSchemaTransform
    });
    app.register(fastifySwaggerUi, {
        routePrefix:"/docs"
    });
});