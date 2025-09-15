import { FastifyReply, FastifyRequest } from "fastify";
import {z} from 'zod';
import { prisma } from "../../config/prisma-client";
const querySchema = z.object({
    id: z.string()
})

export async function controllerSearchDataClient(request: FastifyRequest, reply:FastifyReply){
    try{
        const parse = querySchema.safeParse(request.query);
        if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

        const {id} = parse.data;

        const existsClient = await prisma.client.findUnique({where:{id:id}});

        if(!existsClient) return reply.status(409).send({message:"Esse usuário não existe!"});

        return reply.status(200).send({client: existsClient});
    }
    catch(error){
        console.log("Internal Server Error");
        return reply.status(500).send({error:"Erro interno do servidor."});
    }
}