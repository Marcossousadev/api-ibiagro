import type { FastifyRequest, FastifyReply } from 'fastify';
import { schemaInviteStudentByProfessional } from '../../../../types/schemas/professional/schema-invite-student-by-professional';
import { prisma } from '../../../../config/prisma-client';
import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';
import { generationDateNow } from '../../../../utils/mail/generation-date';
import { sendEmailInviteCodeProfessional } from '../../../../utils/resend/resend-invite-professional';

export async function controllerInviteUnionCodeStudent(request: FastifyRequest, reply: FastifyReply) {
  try {
    const parse = schemaInviteStudentByProfessional.safeParse(request.body);
    const now = new Date();

    if (!parse.success) {
      return reply.status(400).send({ error: parse.error.flatten() });
    }

    const { professionalId, email } = parse.data;

    const existsStudent = await prisma.student.findUnique({ where: { email } });
    if (!existsStudent) {
      return reply.status(409).send({ message: "Esse aluno não é cadastrado!" });
    }

    const existsProfessional = await prisma.professional.findUnique({ where: { id: professionalId } });
    if (!existsProfessional) {
      return reply.status(409).send({ message: "Esse profissional não é cadastrado!" });
    }

    const existingInvite = await prisma.inviteStudentByProfessional.findFirst({
      where: {
        professionalId,
        studentId: existsStudent.id
      }
    });

    if (existingInvite) {
      return reply.status(401).send({
        message: "Esse convite já existe para esse aluno! Se deseja reenviar o convite, vá na aba de reenvio!"
      });
    }

    const code = randomUUID().slice(0, 6).toUpperCase();
    const expiresAt = addMinutes(now, 30);
    const dateInviteEmail = generationDateNow();

    await prisma.inviteStudentByProfessional.create({
      data: {
        professionalId,
        studentId: existsStudent.id,
        code,
        expiresAt,
        email,
      }
    });

    await sendEmailInviteCodeProfessional(
      email,
      existsStudent.fullName,
      existsProfessional.fullName,
      code,
      expiresAt,
      dateInviteEmail,
      'Use o código abaixo para confirmar que esse profissional será seu parceiro dentro do app:'
    );

    return reply.status(200).send({ message: "Convite enviado ao aluno!" });

  } catch (error) {
    console.error("Internal Error Server", error);
    return reply.status(500).send({ error: "Erro interno do servidor!" });
  }
}

export async function controllerResendInviteStudent(request: FastifyRequest, reply: FastifyReply) {
  try {
    const parse = schemaInviteStudentByProfessional.safeParse(request.body);
    const now = new Date();

    if (!parse.success) {
      return reply.status(400).send({ error: parse.error.flatten() });
    }

    const { professionalId, email } = parse.data;

    const existsStudent = await prisma.student.findUnique({ where: { email } });
    if (!existsStudent) {
      return reply.status(409).send({ message: "Esse aluno não é cadastrado!" });
    }

    const existsProfessional = await prisma.professional.findUnique({ where: { id: professionalId } });
    if (!existsProfessional) {
      return reply.status(409).send({ message: "Esse profissional não é cadastrado!" });
    }

    const invite = await prisma.inviteStudentByProfessional.findFirst({
      where: {
        professionalId,
        studentId: existsStudent.id,
        accepted: false,
      },
    });

    if (invite && now > invite.expiresAt) {
      const newCode = randomUUID().slice(0, 6).toUpperCase();
      const newExpiresAt = addMinutes(now, 30);
      const dateInviteEmail = generationDateNow();

      await prisma.inviteStudentByProfessional.update({
        where: { id: invite.id },
        data: {
          code: newCode,
          expiresAt: newExpiresAt,
        },
      });

      await sendEmailInviteCodeProfessional(
        email,
        existsStudent.fullName,
        existsProfessional.fullName,
        newCode,
        newExpiresAt,
        dateInviteEmail,
        'Esse é o novo código para aceitar o convite do seu profissional dentro do app:'
      );

      return reply.status(200).send({ message: "Novo código com nova expiração enviado!" });

    } else if (invite && now < invite.expiresAt) {
      return reply.status(409).send({ message: "O código ainda é válido, aguarde expirar para reenviar!" });
    } else {
      return reply.status(409).send({ message: "Convite não existe! Crie ele primeiro." });
    }

  } catch (error) {
    console.error("Internal Error Server", error);
    return reply.status(500).send({ error: "Erro interno do servidor!" });
  }
}
