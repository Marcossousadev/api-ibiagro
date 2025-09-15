import  { fastify} from "fastify";
import dotenv from 'dotenv';
import { fastifyCors } from "@fastify/cors";
import {routesAuthClient} from './routes/auth/routes-auth-student';
import {routesAuthCompany} from './routes/auth/routes-auth-company';
import {routesEmail} from './routes/auth/mail/routes-code-email';
import {testConnection} from './connections/test-connection-database';
import swaggerConfig from "./config/swagger-config";
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import zodConfig from "./config/zod-config";
import { routes } from "./routes/routes";
import fastifyMultipart from '@fastify/multipart';
import { routesClient } from "./routes/users/client/routes-client";
import { routesCompany } from "./routes/users/company/routes-company";
dotenv.config();

testConnection();

const app = fastify();
app.register(fastifyCors, {origin:"*"});
app.register(zodConfig);
app.register(swaggerConfig);
app.register(fastifyMultipart);
app.withTypeProvider<ZodTypeProvider>();

app.register(routesAuthClient, {prefix:'/client'});
app.register(routesAuthCompany, {prefix:'/company'});
app.register(routesEmail, {prefix:'/email'});
app.register(routes);
app.register(routesClient, {prefix:"/client-actions"});
app.register(routesCompany, {prefix:'/company-actions'})
const PORT = Number(process.env.PORT) || 5555;
app.listen({port:PORT, host:'0.0.0.0'}).then(() => {    
    console.log("Running HTTP");
}) ;
