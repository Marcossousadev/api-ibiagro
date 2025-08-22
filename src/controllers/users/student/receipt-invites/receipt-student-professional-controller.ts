import { FastifyRequest, FastifyReply } from "fastify";
import { schemaAcceptStudentProfessional } from '../../../../types/schemas/student/schema-accept-student-professional';
import { prisma } from '../../../../config/prisma-client';

export async function controllerAcceptInviteProfessional(request: FastifyRequest, reply: FastifyReply) {
  try {
    const parse = schemaAcceptStudentProfessional.safeParse(request.body);

    if (!parse.success) {
      return reply.status(400).send({ error: parse.error.flatten() });
    }

    const { code, studentId } = parse.data;

    const existsStudent = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!existsStudent) {
      return reply.status(401).send({ message: "Esse aluno não existe!" });
    }

    const now = new Date();

    const existsInvite = await prisma.inviteStudentByProfessional.findFirst({
      where: { code, studentId }
    });

    if (!existsInvite) {
      return reply.status(409).send({ message: "Verifique esse código, não é possível verificar o convite!" });
    }

    if (existsInvite.expiresAt < now) {
      return reply.status(409).send({ message: "Convite expirado! Peça um novo ao profissional." });
    }

    if (existsInvite.accepted === true) {
      return reply.status(409).send({ message: "Esse convite já foi aceito!" });
    }

    if (existsInvite.accepted === false && existsInvite.code === code && existsInvite.expiresAt > now) {
      await prisma.inviteStudentByProfessional.update({
        where: { id: existsInvite.id },
        data: { accepted: true }
      });

      await prisma.studentProfessional.create({
        data: {
          studentId: studentId,
          professionalId: existsInvite.professionalId
        }
      });

      return reply.status(200).send({ message: "Convite aceito! Você foi vinculado ao profissional com sucesso!" });
    }
  } catch (error) {
    console.log("Erro interno do servidor", error);
    return reply.status(500).send({ error: "Erro interno do servidor!" });
  }
}
