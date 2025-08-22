import type { FastifyRequest, FastifyReply } from 'fastify';
import {prisma} from '../../../config/prisma-client';
import {z} from 'zod';
const querySchema = z.object({
    id: z.string()
})

export async function controllerSearchDataProfessional(request: FastifyRequest, reply:FastifyReply){
    try{
        const parse = querySchema.safeParse(request.query);

        if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

        const {id} = parse.data;

        const existsProfessional = await prisma.professional.findUnique({where:{id: id}});

        if(!existsProfessional) return reply.status(409).send({message:"Esse usuário não existe!"});

        return reply.status(200).send({professional: existsProfessional});
    }
    catch(error){
        console.log("Internal Error Server", error);
        return reply.status(500).send({error:"Erro interno de servidor!"});
    }
}