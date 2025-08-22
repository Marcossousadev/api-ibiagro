import type {FastifyRequest, FastifyReply } from 'fastify';
import { schemaInviteProfessionalCompany } from '../../../../types/schemas/company/schema-invite-professional-company';
import { prisma } from '../../../../config/prisma-client';
import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';
import { generationDateNow } from '../../../../utils/mail/generation-date';
import { sendEmailInviteCodeCompany } from '../../../../utils/resend/resend-invite-company';

export async function controllerInviteUnionCodeProfessional(request: FastifyRequest, reply:FastifyReply){
    try{
        const parse = schemaInviteProfessionalCompany.safeParse(request.body);
        const now = new Date();

        if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

        const { companyId, email } = parse.data;

        const existsProfessional = await prisma.professional.findUnique({where:{email: email}});

        if(!existsProfessional) return reply.status(409).send({message:"Esse profissional não é cadastrado!"});
        const dataProfessional = existsProfessional;

        const existsCompany = await prisma.company.findUnique({where:{id: companyId}});

        if(!existsCompany) return reply.status(409).send({message:"Essa empresa não é cadastrada!"});
        const dataCompany = existsCompany;

        const existsInviteCompany = await prisma.inviteProfessionalCompany.findFirst({
            where:{companyId: companyId, professionalId: dataProfessional.id}});

            if(existsInviteCompany) return reply.status(401).send({message:"Esse convite já existe para esse professional! Se deseja reenviar o convite, vá na aba de reenvio!"});

            const code = randomUUID().slice(0, 6).toUpperCase();
            const expiresAtTime = addMinutes(now, 30);

            const invite = await prisma.inviteProfessionalCompany.create({data:{
                companyId:companyId,
                professionalId: dataProfessional.id,
                code: code,
                expiresAt: expiresAtTime,
                email: email
            }});
            const dateInviteEmail = generationDateNow();
            await sendEmailInviteCodeCompany(email, dataProfessional.fullName, dataCompany.fullName, code, expiresAtTime, dateInviteEmail, 'Use o código abaixo para confirmar que a empresa será sua parceira, dentro do app:' )
            return reply.status(200).send({message:"Convite enviado ao professional!"});
    }
    catch(error){
        console.log("Internal Error Server", error);
        return reply.status(500).send({error: "Erro interno do servidor!"});
    }
}

export async function controllerResendInviteProfessional(request: FastifyRequest, reply: FastifyReply){
    try{
        const parse = schemaInviteProfessionalCompany.safeParse(request.body);
        const now = new Date();
        if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

        const { companyId, email } = parse.data;

        const existsProfessional = await prisma.professional.findUnique({where:{email: email}});

        if(!existsProfessional) return reply.status(401).send({message:"Esse professional não é cadastrado!"});

        const existsCompany = await prisma.company.findUnique({where:{id: companyId}});

        if(!existsCompany) return reply.status(401).send({message:"Essa empresa não é cadastrada!"});

        const existsInvite = await prisma.inviteProfessionalCompany.findFirst({
            where:{
                companyId,
                professionalId: existsProfessional.id,
                accepted: false
            },
        });
        if(existsInvite && now > existsInvite?.expiresAt){
            try{              
              const newCode = randomUUID().slice(0, 6).toUpperCase();
              const newExpiresAt = addMinutes(now, 30);
              await prisma.inviteProfessionalCompany.update({where:{id: existsInvite.id, 
               companyId:companyId, 
                professionalId: existsProfessional.id, 
               accepted:false}, 
                data:{code:newCode, expiresAt: newExpiresAt}});
              return reply.status(200).send({message:"Novo código com nova expiração enviados!"});
           }
            catch(error){
             console.log("Erro ao atualizar reenvio", error);
            }
        }
        else if(existsInvite && now < existsInvite?.expiresAt){
            return reply.status(409).send({message:"Impossível gerar outro código, o código enviado do professional ainda é válido!"});
         }
        else {
          return reply.status(409).send({message:"Já que seu convite ao professional não existe, crie ele!"});
        }
      }
      catch(error){
        console.log("Internal Error Server", error);
        return reply.status(500).send({error:"Erro interno do servidor!"});
    }
};