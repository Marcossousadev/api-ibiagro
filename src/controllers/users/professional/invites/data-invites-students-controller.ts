import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from '../../../../config/prisma-client';

export async function controllerInviteNotAcceptedStudentsByProfessional(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { professionalId } = request.query as { professionalId: string };

    const existsProfessional = await prisma.professional.findUnique({
      where: { id: professionalId }
    });

    if (!existsProfessional) {
      return reply.status(401).send({ message: "Esse profissional não é cadastrado!" });
    }

    const invites = await prisma.inviteStudentByProfessional.findMany({
      where: {
        professionalId: professionalId,
        accepted: false
      }
    });

    if (!invites) {
      return reply.status(409).send({ message: "Não há registros de convites não aceitos por alunos..." });
    }

    return reply.status(200).send({ invites });
  } catch (error) {
    console.log("Internal Error Server", error);
    return reply.status(500).send({ error: "Erro interno do servidor!" });
  }
}
