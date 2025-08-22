/*
  Warnings:

  - Added the required column `email` to the `InviteCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `InviteProfessionalCompany` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InviteCompany" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InviteProfessionalCompany" ADD COLUMN     "email" TEXT NOT NULL;
