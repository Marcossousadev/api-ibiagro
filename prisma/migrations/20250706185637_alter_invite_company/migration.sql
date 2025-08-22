/*
  Warnings:

  - You are about to drop the `Invite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Invite";

-- DropEnum
DROP TYPE "InviteStatus";

-- CreateTable
CREATE TABLE "InviteCompany" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InviteCompany_pkey" PRIMARY KEY ("id")
);
