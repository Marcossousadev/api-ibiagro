import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import {serializerCompiler, validatorCompiler} from 'fastify-type-provider-zod';

export default fp(async function zodConfig(app:FastifyInstance){
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
});
 