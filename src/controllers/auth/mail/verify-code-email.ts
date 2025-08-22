import {schemaVerifyCodeEmail} from '../../../types/schemas/auth/mail/schema-verify-code-email';
import { FastifyRequest, FastifyReply } from 'fastify';
import {prisma} from '../../../config/prisma-client';
export async function controllerVerifyCode(request: FastifyRequest, reply: FastifyReply){
    try{
        const parse = schemaVerifyCodeEmail.safeParse(request.body);
        if(!parse.success){
            return reply.status(400).send({error: parse.error.flatten()});
        }
        const { code, email, role } = parse.data;
        let user;
      switch(role) {
        case 'student':
            const userStudent = await prisma.student.findUnique({where: {email}});
            user = userStudent;
            break;
        case 'company':
            const userCompany = await prisma.company.findUnique({where: {email}});
            user = userCompany;  
            break;
         case 'professional':
            const userProfessional = await prisma.professional.findUnique({where:{email}});
            user = userProfessional;
            break;
         default:
            user = null;
      }
        if(!user){
            return reply.status(404).send({message:"Usuário não encontrado!"});
        }
        if(user.isEmailVerified === true){
            return reply.status(409).send({message:"Email já verificado!"});
        }
        if(user.emailCodeVerification !== code) {
            return reply.status(409).send({message: "Código inválido!"});
        }
        if(!user.emailVerificationExpires || user.emailVerificationExpires < new Date()){
            return reply.status(409).send({message:"Tempo expirado! Solicite outro código!"});
        }
       switch(role){
        case 'student':
             await prisma.student.update({
            where: {email},
            data:{
                isEmailVerified:true,
                emailCodeVerification:null,
                emailVerificationExpires:null
            }
        });
        break;
        case 'professional':
             await prisma.professional.update({
            where: {email},
            data:{
                isEmailVerified:true,
                emailCodeVerification:null,
                emailVerificationExpires:null
            }
        });
        break;
        case 'company':
             await prisma.company.update({
            where: {email},
            data:{
                isEmailVerified:true,
                emailCodeVerification:null,
                emailVerificationExpires:null
            }
        });
        break;
        default: 
        console.log("Forneça o tipo de usuário!")
       }
        return reply.status(200).send({message:"Email verificado com sucesso!"});
    }
    catch(error){
        console.log("Erro interno do servidor!", error);
        return reply.status(500).send({error:`Erro interno do servidor! ${error}`});
    }
}