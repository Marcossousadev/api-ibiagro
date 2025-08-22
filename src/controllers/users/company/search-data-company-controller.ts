import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../config/prisma-client';
import {z} from 'zod';

const querySchema = z.object({
    id: z.string()
});

export async function controllerSearchDataCompany(request: FastifyRequest, reply:FastifyReply){
    try{
        const parse = querySchema.safeParse(request.query);

        if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

        const {id} = parse.data;

        const existsCompany = await prisma.company.findUnique({where:{id: id}});

        if(!existsCompany) return reply.status(409).send({message:"Essa empresa não existe!"});
        
        return reply.status(200).send({company: existsCompany});
    }
    catch(error){
        console.log("Erro interno do servidor", error);
        return reply.status(500).send({error:"Erro interno do servidor!"})
    }
}