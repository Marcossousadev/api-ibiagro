/*
  Warnings:

  - You are about to drop the column `role` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `InviteCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InviteProfessionalCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InviteStudentByProfessional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Professional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentProfessional` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameResponse` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneCompany` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stay` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Professional" DROP CONSTRAINT "Professional_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_companyId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfessional" DROP CONSTRAINT "StudentProfessional_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfessional" DROP CONSTRAINT "StudentProfessional_studentId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "role",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "nameResponse" TEXT NOT NULL,
ADD COLUMN     "phoneCompany" TEXT NOT NULL,
ADD COLUMN     "stay" TEXT NOT NULL;

-- DropTable
DROP TABLE "InviteCompany";

-- DropTable
DROP TABLE "InviteProfessionalCompany";

-- DropTable
DROP TABLE "InviteStudentByProfessional";

-- DropTable
DROP TABLE "Professional";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "StudentProfessional";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "TypeProfessional";

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailCodeVerification" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationExpires" TIMESTAMP(3),
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "stay" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
