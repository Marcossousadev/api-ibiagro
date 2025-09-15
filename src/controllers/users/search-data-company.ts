import { error } from "console";
import { FastifyReply, FastifyRequest } from "fastify";
import {z} from 'zod';
import { prisma } from "../../config/prisma-client";

const queryschema = z.object({
    id: z.string()
})
export async function controllerSearchDataCompany(request: FastifyRequest, reply: FastifyReply){
    try{
        const parse = queryschema.safeParse(request.query);

        if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

        const {id} = parse.data;

        const existsCompany = await prisma.company.findUnique({where:{id:id}});

        if(!existsCompany) return reply.status(409).send({message:"Essa empresa não existe!"});

        return reply.status(200).send({company: existsCompany});
    }
    catch(error){
        console.log("Internal Server Error", error);
        return reply.status(500).send({error:"Erro interno do servidor"});
    }
}