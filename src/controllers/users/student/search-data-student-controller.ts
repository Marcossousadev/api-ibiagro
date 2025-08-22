import type { FastifyRequest, FastifyReply } from 'fastify';
import {prisma} from '../../../config/prisma-client';
import {z} from 'zod';

const querySchema = z.object({
    id: z.string()
})
export async function controllerSearchDataStudent(request: FastifyRequest, reply:FastifyReply){
    try{
        const parse = querySchema.safeParse(request.query);

        if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

        const {id} = parse.data;

        const existsStudent = await prisma.student.findUnique({where:{id:id}, include:{
            company: true,
            professionals:{
                include: {professional: true}
            }
        }});

        if(!existsStudent) return reply.status(409).send({message:"Esse usuário não existe!"});

        return reply.status(200).send({student: existsStudent});
    }
    catch(error){
        console.log("Internal Error Server", error);
        reply.status(500).send({error:"Erro interno do servidor!"});
    }
}