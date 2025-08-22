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
import { routesCompany } from "./routes/users/company/routes-company";
import { routesStudent } from "./routes/users/student/routes-student";
import { routesProfessional } from "./routes/users/professional/routes-professional";
import fastifyMultipart from '@fastify/multipart';
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
app.register(routesCompany, {prefix:'/company-actions'});
app.register(routesStudent, {prefix:'/student-actions'});
app.register(routesProfessional, {prefix:'/professional-actions'});
app.register(routes);

const PORT = Number(process.env.PORT) || 5555;
app.listen({port:PORT, host:'0.0.0.0'}).then(() => {    
    console.log("Running HTTP");
}) ;
