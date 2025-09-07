import type {FastifyRequest, FastifyReply} from 'fastify';
import {schemaCompany} from '../../types/schemas/auth/company-schema';
import {schemaSignInCompany} from '../../types/schemas/auth/schema-sigin-company';
import { schemaAuthDecodeCompany } from '../../types/schemas/auth/decode-jwt/schema-auth-decode-company';
import {prisma} from '../../config/prisma-client';
import bcrypt from 'bcryptjs';
import { generationCodeEmail } from '../../utils/mail/generation-code-email';
import { generationDateNow } from '../../utils/mail/generation-date';
import { generationTimeVerificationEmail } from '../../utils/mail/generation-time-verification-email';
import { sendEmailVerificationCode } from '../../utils/resend/resend-util';
import { sendEmailInviteCodeCompany } from '../../utils/resend/resend-invite-company';
import { randomUUID } from 'crypto';
import { supabase } from '../../config/subapase-config';
import jwt from 'jsonwebtoken';
import * as JwtDecode from 'jwt-decode';

export async function controllerAuthSignUpCompany(request: FastifyRequest, reply: FastifyReply){
  try{
    const parse = schemaCompany.safeParse(request.body);

    if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

    const {id, companyName, email, password, imageUrl, cnpj, city, nameResponse, phoneCompany, stay, createdAt, updateAt, role} = parse.data;

    const existsCompanyEmail = await prisma.company.findUnique({where: {email}});
    const existsCompanyCnpj = await prisma.company.findUnique({where: {cnpj}});

    if(existsCompanyEmail && existsCompanyCnpj) return reply.status(409).send({message:"Email e Cnpj utilizados por outra empresa, faça o cadastro com outro email e cnpj."});
    if(existsCompanyEmail) return reply.status(409).send({message:"Email utilizado por outra empresa, faça o cadastro com outro email."});
    if(existsCompanyCnpj) return reply.status(409).send({message:"Cnpj utilizado por outra empresa, faça o cadastro com outro cnpj."});
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
    await prisma.company.create({
        data:{
            fullName: companyName,
            email,
            password: hashedPassword,
            imageUrl: data.publicUrl,
            cnpj,
            isEmailVerified:false,
            emailCodeVerification: codeEmailVerification,
            emailVerificationExpires: timeExpiresVerificationEmail,
            city: city,
            nameResponse: nameResponse,
            phoneCompany: phoneCompany,
            stay: stay,
            role: role
        },
        select:{
          id: true,
          fullName:true,
          email:true,
          createdAt:true,
        }
    });
    await sendEmailVerificationCode(email, companyName, codeEmailVerification, timeExpiresVerificationEmail, dateSignUpSendEmailVerification);
    return reply.status(201).send({message:"Cadastro realizado! Agora confirme seu Email.", timeExpiresVerificationEmail: timeExpiresVerificationEmail  });
  }
  catch(error){
    console.log("Erro ao fazer cadastro da empresa!");
    return reply.status(500).send({error:`Erro interno do servidor. ${error}`,});
  }
}

export async function controllerAuthSignUpCompanyImg(request: FastifyRequest, reply: FastifyReply){
  try{
    const parse = schemaCompany.safeParse(request.body);

    if(!parse.success) return reply.status(400).send({error: parse.error.flatten()});

    const {id, companyName, email, password, imageUrl, cnpj, city, nameResponse, phoneCompany, stay, createdAt, updateAt, role} = parse.data;

    const existsCompanyEmail = await prisma.company.findUnique({where: {email}});
    const existsCompanyCnpj = await prisma.company.findUnique({where: {cnpj}});

    if(existsCompanyEmail && existsCompanyCnpj) return reply.status(409).send({message:"Email e Cnpj utilizados por outra empresa, faça o cadastro com outro email e cnpj."});
    if(existsCompanyEmail) return reply.status(409).send({message:"Email utilizado por outra empresa, faça o cadastro com outro email."});
    if(existsCompanyCnpj) return reply.status(409).send({message:"Cnpj utilizado por outra empresa, faça o cadastro com outro cnpj."});
    const hashedPassword = String( await bcrypt.hash(password, 10));
    const timeExpiresVerificationEmail = generationTimeVerificationEmail();
    const codeEmailVerification = generationCodeEmail();
    const dateSignUpSendEmailVerification = generationDateNow();
    await prisma.company.create({
        data:{
            fullName: companyName,
            email,
            password: hashedPassword,
            imageUrl: imageUrl,
            cnpj,
            isEmailVerified:false,
            emailCodeVerification: codeEmailVerification,
            emailVerificationExpires: timeExpiresVerificationEmail,
            city: city,
            nameResponse: nameResponse,
            phoneCompany: phoneCompany,
            stay: stay,
            role:role
        },
        select:{
          id: true,
          fullName:true,
          email:true,
          createdAt:true,
        }
    });
    await sendEmailVerificationCode(email, companyName, codeEmailVerification, timeExpiresVerificationEmail, dateSignUpSendEmailVerification);
    return reply.status(201).send({message:"Cadastro realizado! Agora confirme seu Email.", timeExpiresVerificationEmail: timeExpiresVerificationEmail  });
  }
  catch(error){
    console.log("Erro ao fazer cadastro da empresa!");
    return reply.status(500).send({error:`Erro interno do servidor. ${error}`,});
  }
}

export async function controllerAuthSignInCompany(request: FastifyRequest, reply: FastifyReply){
  try{
    const parse = schemaSignInCompany.safeParse(request.body);

    if(!parse.success){
      return reply.status(400).send({error: parse.error.flatten()});
    }

    const { email, password } = parse.data;

    const company = await prisma.company.findUnique({where:{email}});

    if(!company){
      return reply.status(401).send({message:"Empresa não encontrada!"});
    }
    const isPasswordValid = await bcrypt.compare(password, company.password);

    if(!isPasswordValid){
      return reply.status(401).send({message:"Senha incorreta!"});
    }

    if(company.isEmailVerified === false){
      return reply.status(409).send({message:"Verifique seu email para liberar o login!"});
    }

    const token = jwt.sign({id:company.id,fullName: company.fullName, 
      email: company.email, role: company.role, imageUrl: company.imageUrl}, process.env.JWT_SECRET as string, 
      {expiresIn:'8h'});

    return reply.status(200).send({message:"Login realizado com sucesso!", token: token});
  }
  catch(error){
    console.log("Erro ao fazer login da empresa!", error);
    return reply.status(500).send({error:"Erro interno do servidor."});
  }
}

export async function controllerAuthDecodeJwtCompany(request: FastifyRequest, reply: FastifyReply){
  try{
    const parse = schemaAuthDecodeCompany.safeParse(request.body);

    if(!parse.success){
      return reply.status(400).send({message: parse.error.flatten()});
    }

    const { jwtCompany } = parse.data;

    let verifyJwt;

    try{
      verifyJwt = jwt.verify(jwtCompany, process.env.JWT_SECRET as string);
    }
    catch(error: any){
      if(error instanceof jwt.TokenExpiredError){
        return reply.status(401).send({message: "Token expirado."});
      }
      else {
        return reply.status(401).send({message: "Token inválido!"})
      }
    }
    const jwtDecode = JwtDecode.jwtDecode(jwtCompany);
    return reply.status(200).send({jwtDecode:jwtDecode});
  }
  catch(error){
    console.log("Erro interno de servidor", error);
    return reply.status(500).send({error:"Internal Error server"});
  }
}

export async function controllerVerifyToken(request: FastifyRequest, reply: FastifyReply){
    try{
    const headerAuthorization = request.headers.authorization;
    if(!headerAuthorization?.startsWith('Bearer ')){
      return reply.status(401).send({message: "Token não fornecido", valid:false});
    }
    const tokenJwt = headerAuthorization.split(' ')[1];
    let verifyToken;
      try{
        verifyToken = jwt.verify(tokenJwt, process.env.JWT_SECRET as string);
      }
      catch(error: any){
         console.log("Erro ao verificar token", error);
        if(error instanceof jwt.TokenExpiredError){
          return reply.status(401).send({message:"Token expirado", valid: false});
        }
        else {
          return reply.status(401).send({message:"Token inválido!", valid: false})
        }
      }
      return reply.status(200).send({message:"Token válido", valid: true});
    }
    catch(error: any){
      console.log("Erro interno do servidor", error);
      return reply.status(500).send({error:"Internal Error Server"});
    }
}
