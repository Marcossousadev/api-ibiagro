import {prisma} from '../../config/prisma-client'
import type { FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';
import {clientSchema} from '../../types/schemas/auth/client-schema';
import { schemaSignInClient } from '../../types/schemas/auth/schema-signin-client';
import {schemaAuthDecodeClient} from '../../types/schemas/auth/decode-jwt/schema-auth-decode-client';
import bcrypt from 'bcryptjs';
import {generationCodeEmail} from '../../utils/mail/generation-code-email';
import {generationTimeVerificationEmail} from '../../utils/mail/generation-time-verification-email';
import {sendEmailVerificationCode} from '../../utils/resend/resend-util';
import {generationDateNow} from '../../utils/mail/generation-date';
import jwt from 'jsonwebtoken'
import * as JwtDecode from 'jwt-decode';
import { randomUUID } from 'crypto';
import { supabase } from '../../config/subapase-config';

export async function controllerAuthSignUpClient(request:FastifyRequest, reply:FastifyReply){
  try{
    const parsed = clientSchema.safeParse(request.body);
    if(!parsed.success) return reply.status(400).send({ error: parsed.error.flatten()});
    const {id, fullName, imageUrl, email, password, age, role, createdAt, updateAt, city, cpf, phone, stay } = parsed.data;
    const clientExists = await prisma.client.findUnique({where: {email}});
    if(clientExists){
        return reply.status(409).send({message:"Esse email já está em uso, faça o cadastro com outro email!"});
    }
     const match = imageUrl.match(/^data:(image\/[a-zA-Z]+);base64,/);

    if(!match){
      return reply.status(409).send({message:"Formato da imagem inválido!"});
    }
    const contentType = match[1]; // Ex: image/png, image/jpeg
    const extension = contentType.split('/')[1]; // Ex: png, jpeg
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `${randomUUID()}.${extension}`;
    const { error:uploadError } = await supabase.storage.from('images').upload(fileName, buffer, {
      contentType,
      upsert:true,
    });
    if(uploadError){
      console.log("Erro no upload da imagem", uploadError.message)
      return reply.status(409).send({message:"Erro no upload da imagem!"})
    }
    const {data} = await supabase.storage.from('images').getPublicUrl(fileName);

    const hashedPassword = String( await bcrypt.hash(password, 10)); 
    const timeExpiresVerificationEmail = generationTimeVerificationEmail();
    const codeEmailVerification = generationCodeEmail();
    const dateSignUpSendEmailVerification = generationDateNow();
    await prisma.client.create({
        data:{  
            fullName,
            imageUrl: data.publicUrl,
            email,
            password:hashedPassword,
            age,
            role:'CLIENT',
            isEmailVerified:false,
            emailVerificationExpires:timeExpiresVerificationEmail,
            emailCodeVerification: codeEmailVerification,
            city:city,
            cpf:cpf,
            phone:phone,
            stay:stay
        },
        select:{
          id:true,
          fullName:true,
          email:true,
          age:true,
          role:true,
          createdAt:true
        }
    });
   await sendEmailVerificationCode(email, fullName, codeEmailVerification, timeExpiresVerificationEmail, dateSignUpSendEmailVerification);
   return reply.status(201).send({message:"Cadastro realizado! Agora confirme seu email.", timeExpiresVerificationEmail: timeExpiresVerificationEmail });
  }
  catch(error){
    console.log("Erro ao cadastrar usuário", error);
    return reply.status(500).send({message:"Erro interno do servidor."});
  }
}
export async function controllerAuthSignUpClientImg(request:FastifyRequest, reply:FastifyReply){
  try{
    const parsed = clientSchema.safeParse(request.body);
    if(!parsed.success) return reply.status(400).send({ error: parsed.error.flatten()});
    const {id, fullName, imageUrl, email, password, age, role, createdAt, updateAt, city, cpf, phone, stay} = parsed.data;
    const studentExists = await prisma.client.findUnique({where: {email}});
    if(studentExists){
        return reply.status(409).send({message:"Esse email já está em uso, faça o cadastro com outro email!"});
    }
    const hashedPassword = String( await bcrypt.hash(password, 10)); 
    const timeExpiresVerificationEmail = generationTimeVerificationEmail();
    const codeEmailVerification = generationCodeEmail();
    const dateSignUpSendEmailVerification = generationDateNow();
    await prisma.client.create({
        data:{  
            fullName,
            imageUrl: imageUrl,
            email,
            password:hashedPassword,
            age,
            role:'CLIENT',
            isEmailVerified:false,
            emailVerificationExpires:timeExpiresVerificationEmail,
            emailCodeVerification: codeEmailVerification,
            city:city,
            cpf:cpf,
            phone:phone,
            stay:stay
        },
        select:{
          id:true,
          fullName:true,
          email:true,
          age:true,
          role:true,
          createdAt:true
        }
    });
   await sendEmailVerificationCode(email, fullName, codeEmailVerification, timeExpiresVerificationEmail, dateSignUpSendEmailVerification);
   return reply.status(201).send({message:"Cadastro realizado! Agora confirme seu email.", timeExpiresVerificationEmail: timeExpiresVerificationEmail });
  }
  catch(error){
    console.log("Erro ao cadastrar usuário", error);
    return reply.status(500).send({message:"Erro interno do servidor."});
  }
}
export async function controllerAuthSigInClient(request:FastifyRequest, reply:FastifyReply){
    try{
      const parse = schemaSignInClient.safeParse(request.body);

      if(!parse.success){
        return reply.status(400).send({error: parse.error.flatten()});
      }

      const {email, password} = parse.data;

      const student = await prisma.client.findUnique({where:{email}});

      if(!student){
        return reply.status(401).send({message:"Usuário não encontrado!"});
      }

      const isPasswordValid = await bcrypt.compare(password, student.password);

      if(!isPasswordValid){
        return reply.status(401).send({message:"Senha inválida!"});
      }
   
      if(student.isEmailVerified === false){
        return reply.status(409).send({message:"Verifique seu email para liberar o login!"});
      }

      const token = jwt.sign({id: student.id, fullName: student.fullName, email: student.email, role: student.role,
        imageUrl: student.imageUrl
      }, process.env.JWT_SECRET as string, {expiresIn:'8h'});

      return reply.status(200).send({
        message:"Login realizado com sucesso!",
        token: token
      });
      }
    catch(error){
        console.log("Error signIn the student", error);
        return reply.status(500).send({error:'Internal server error'});
    }
}

export async function controllerAuthDecodeJwtClient(request:FastifyRequest, reply:FastifyReply){
  try{
    const parse = schemaAuthDecodeClient.safeParse(request.body);

    if(!parse.success){
        return reply.status(400).send({error: parse.error.flatten()});
    }
      const { jwtClient } = parse.data;

      let verifyJwt;

      try{  
        verifyJwt = jwt.verify(jwtClient, process.env.JWT_SECRET as string);
      }
      catch(error){
        if(error instanceof jwt.TokenExpiredError){
          return reply.status(401).send({message:"Token expirado"});
        }
        else {
          return reply.status(401).send({message:"Token inválido!"});
        }
      }
      const jwtDecode = JwtDecode.jwtDecode(jwtClient);

      return reply.status(200).send({jwtDecode: jwtDecode});
  }
  catch(error){
    console.log("Error interno do servidor", error);
    return reply.status(500).send({error: "Internal server error"});
  }
}

export async function controllerVerifyToken(request: FastifyRequest, reply: FastifyReply){
  try{
    const headerAuthorization = request.headers.authorization;

    if(!headerAuthorization?.startsWith('Bearer ')){
      return reply.status(401).send({message:"Token não fornecido", valid: false});
    }
    const tokenJwt = headerAuthorization.split(' ')[1];
    let verifyJwt;
    try{
      verifyJwt = jwt.verify(tokenJwt, process.env.JWT_SECRET as string);
    }
    catch(error: any){
      console.log("Erro ao verificar token", error);
      if(error instanceof jwt.TokenExpiredError){
        return reply.status(401).send({message: "Token expirado", valid: false});
      }
      else {
       return reply.status(401).send({message: "Token inválido", valid: false});
      }
    }
     return reply.status(200).send({message:"Token válido", valid: true});
  }
  catch(error: any){
    console.log("Erro ao verificar token", error);
    return reply.status(500).send({error:"Internal Error Server"});
  }
}

