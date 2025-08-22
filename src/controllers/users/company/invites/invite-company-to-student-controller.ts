import type { FastifyReply, FastifyRequest} from 'fastify';
import {prisma} from '../../../../config/prisma-client';
import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';
import { schemaInviteStudent} from '../../../../types/schemas/company/schema-invite-student-company';
import { sendEmailInviteCodeCompany } from '../../../../utils/resend/resend-invite-company';
import { generationDateNow } from '../../../../utils/mail/generation-date';
export async function controllerInviteUnionCodeStudent(request: FastifyRequest, reply: FastifyReply){
  try{
    const parse = schemaInviteStudent.safeParse(request.body);
    const now = new Date();

    if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

    const {email, companyId} = parse.data;

    const student = await prisma.student.findUnique({where:{email}});
    
    if(!student) return reply.status(409).send({message:"Esse aluno não é cadastrado!"});
    const dataStudent = student;
    const company = await prisma.company.findUnique({where: {id: companyId}});
    if(!company) return reply.status(409).send({message:"Essa empresa não é cadastrada"});
    const dataCompany = company;
    
    const existsInviteCompany = await prisma.inviteCompany.findFirst({
      where:{
        companyId : companyId,
        studentId: dataStudent.id
      }});

       if(existsInviteCompany){
          return reply.status(401).send({message:"Esse convite já existe para esse aluno! Se deseja reenviar o convite, vá na aba de reenvio!"})
       }
       
        const code = randomUUID().slice(0, 6).toUpperCase();
        const expiresAtTime = addMinutes(now, 30);
        const invite = await prisma.inviteCompany.create({
        data:{
          companyId,
          studentId: dataStudent.id,
          code,
          expiresAt: expiresAtTime,
          email:email
        },
      });
      const dateInviteEmail = generationDateNow();
      await sendEmailInviteCodeCompany(email, dataStudent.fullName, dataCompany.fullName, code, expiresAtTime, dateInviteEmail, 'Use o código abaixo para confirmar que a empresa cuidará de você, dentro do app:');
      return reply.status(200).send({message:"Convite enviado ao aluno!"});
  }
  catch(error: any){
    console.log("Internal Error Server", error)
    return reply.status(500).send({error: "Erro interno do servidor"});
  }
};

export async function controllerResendInvite(request: FastifyRequest, reply: FastifyReply){
  try{
    const parse = schemaInviteStudent.safeParse(request.body);
     if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});
      const now = new Date();
     const {email,  companyId} = parse.data;

     const student = await prisma.student.findUnique({where:{email}});

     if(!student) return reply.status(401).send({message:"Esse aluno não é cadastrado!"});

     const company = await prisma.company.findUnique({where: {id: companyId}});

     if(!company) return reply.status(401).send({message:"Essa empresa não é cadastrada"});

     const existsInvite: any = await prisma.inviteCompany.findFirst({
      where:{
        companyId,
        studentId: student.id,
        accepted:false,
      },
     });

     if(existsInvite && now > existsInvite?.expiresAt){
     try{
      const newCode = randomUUID().slice(0, 6).toUpperCase();
      const newExpiresAt = addMinutes(now, 30);
      await prisma.inviteCompany.update({where:{id: existsInvite.id, 
        companyId:companyId, studentId:student.id, accepted:false}, data:{code:newCode,
          expiresAt: newExpiresAt}});
          return reply.status(200).send({message:"Novo código com nova expiração enviados!"});
     }
     catch(error){
      console.log("Erro ao atualizar reenvio", error);
     }
     }
     else if(existsInvite && now < existsInvite?.expiresAt){
      return reply.status(409).send({message:"Impossível gerar outro código, o código enviado ao aluno ainda é válido!"});
     }
     else {
      return reply.status(409).send({message:"Já que seu convite ao aluno não existe, crie ele!"});
     }
  }
  catch(error: any){
    console.log("Internal Error Server", error);
    return reply.status(500).send({error:"Erro interno do servidor"});
  }
};

