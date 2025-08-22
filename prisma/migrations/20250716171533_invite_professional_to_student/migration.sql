-- CreateTable
CREATE TABLE "InviteStudentByProfessional" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InviteStudentByProfessional_pkey" PRIMARY KEY ("id")
);
