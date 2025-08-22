import { FastifyReply, FastifyRequest } from "fastify";
import {schemaAcceptStudentCompany} from '../../../../types/schemas/student/schema-accept-student-company';
import { prisma } from '../../../../config/prisma-client';

export async function controllerAcceptInviteCompany(request: FastifyRequest, reply: FastifyReply){
    try{
        const parse = schemaAcceptStudentCompany.safeParse(request.body);

        if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

        const { code, studentId } = parse.data;
        const existsStudent = await prisma.student.findUnique({where:{id: studentId}});

        if(!existsStudent) return reply.status(401).send({message:"Esse aluno não existe!"});
        const now = new Date();
        const exitsInvite = await prisma.inviteCompany.findFirst({
            where:{code, studentId}});

            if(!exitsInvite) return reply.status(409).send({message:"Verifique esse código, não é possível verificar convite!"});
            if(exitsInvite && exitsInvite.expiresAt < now) return reply.status(409).send({message:"Convite expirado! Fale com a empresa para enviar outro convite!"});
            if(exitsInvite && exitsInvite.accepted === true) return reply.status(409).send({message:"Esse convite já foi aceito!"});

            if(exitsInvite && exitsInvite.accepted === false && exitsInvite.code === code && exitsInvite.expiresAt > now) {
                await prisma.inviteCompany.update({
                    where:{id: exitsInvite.id},
                    data:{
                        accepted: true
                    }});

                    await prisma.student.update({
                        where:{id: studentId},
                        data: {companyId: exitsInvite.companyId}
                    });

                    return reply.status(200).send({ message: "Convite aceito você foi vinculado a empresa com sucesso!" });
            }
    }
    catch(error: any){
        console.log("Erro interno do servidor", error);
        return reply.status(500).send({error: "Internal Error Server"});
    }
}