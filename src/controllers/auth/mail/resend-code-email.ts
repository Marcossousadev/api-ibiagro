import {FastifyRequest, FastifyReply} from 'fastify';
import {schemaResendCodeEmail} from '../../../types/schemas/auth/mail/schema-resend-code-email';
import { prisma } from '../../../config/prisma-client';
import {generationCodeEmail} from '../../../utils/mail/generation-code-email';
import {generationTimeVerificationEmail} from '../../../utils/mail/generation-time-verification-email';
import {generationDateNow} from '../../../utils/mail/generation-date';
import { sendEmailVerificationCode } from '../../../utils/resend/resend-util';
export async function controllerResendCodeEmail(request: FastifyRequest, reply: FastifyReply){
    try{
        const parse = schemaResendCodeEmail.safeParse(request.body);
        const codeEmailVerification = generationCodeEmail();
        const timeExpiresVerificationEmail = generationTimeVerificationEmail();
        const dateSignUpSendEmailVerification = generationDateNow();

        if(!parse.success){
            return reply.status(400).send({error: parse.error.flatten()});
        }
        const { email, role } = parse.data;
        let user;
        switch(role){
            case 'student':
                const userStudent = await prisma.student.findUnique({where:{email}});
                user = userStudent;
                break;
            case 'company':
                const userCompany = await prisma.company.findUnique({where:{email}});
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
            return reply.status(404).send({message: "Usuário não existe!"});
        }

        if(user.isEmailVerified === true){
            return reply.status(409).send({message:"Impossível reenviar um código para verificar um email já verificado!"});
        }
        const date = new Date();
        console.log(date);
        if(!user.emailVerificationExpires || date < user.emailVerificationExpires){
            console.log(user.emailVerificationExpires)
             return reply.status(409).send({message:"Espere o código anterior expirar, para requisitar outro!"});
        }
      
        switch(role){
            case 'student':
                 await prisma.student.update({
            where:{email},
            data:{
                emailCodeVerification: codeEmailVerification,
                emailVerificationExpires: timeExpiresVerificationEmail
            }
        });
        break;
         case 'professional':
              await prisma.professional.update({
            where:{email},
            data:{
                emailCodeVerification: codeEmailVerification,
                emailVerificationExpires: timeExpiresVerificationEmail
            }
        });
        break;
        case 'company':
              await prisma.company.update({
            where:{email},
            data:{
                emailCodeVerification: codeEmailVerification,
                emailVerificationExpires: timeExpiresVerificationEmail
            }
        });
        break;
        default: 
        console.log("Forneça o tipo de usuário!")
    }

     await sendEmailVerificationCode(email, user.role, codeEmailVerification, timeExpiresVerificationEmail, dateSignUpSendEmailVerification);
     return reply.status(200).send({message:"Código de verificação no seu email!", timeExpiresVerificationEmail: timeExpiresVerificationEmail})
    }
    catch(error){
        console.log("Erro no reenvio de email.")
        return reply.status(500).send({error: "Erro interno do servidor."})
    }
}