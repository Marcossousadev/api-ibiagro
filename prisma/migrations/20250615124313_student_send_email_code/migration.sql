/*
  Warnings:

  - Added the required column `emailVerificationExpires` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "emailCodeVerification" TEXT,
ADD COLUMN     "emailVerificationExpires" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
