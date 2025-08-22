/*
  Warnings:

  - Added the required column `emailCodeVerification` to the `Professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailVerificationExpires` to the `Professional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "emailCodeVerification" TEXT NOT NULL,
ADD COLUMN     "emailVerificationExpires" INTEGER NOT NULL,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
