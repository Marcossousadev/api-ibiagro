-- CreateTable
CREATE TABLE "InviteProfessionalCompany" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InviteProfessionalCompany_pkey" PRIMARY KEY ("id")
);
