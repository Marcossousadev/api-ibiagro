import type {FastifyRequest, FastifyReply} from 'fastify';
import { prisma } from '../../../../config/prisma-client';

export async function controllerDataInvitesProfessionalsNotAccepted(request: FastifyRequest, reply: FastifyReply){
    try{
        const {companyId} = request.query as {companyId: string};

        const existsCompany = await prisma.company.findUnique({where:{id: companyId}});

        if(!existsCompany) return reply.status(401).send({message:"Essa empresa não é cadastrada!"});

        const existsInvitesCompany = await prisma.inviteProfessionalCompany.findMany({where:{companyId: companyId, accepted:false}});

        if(!existsInvitesCompany) return reply.status(409).send({message:"Não há registros!"});

        return reply.status(200).send({invites: existsInvitesCompany});
    }
    catch(error){
        console.log("Internal Error Server", error);
        return reply.status(500).send({error:"Internal Error Server"});
    }

}