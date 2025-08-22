/*
  Warnings:

  - The `emailVerificationExpires` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `emailVerificationExpires` column on the `Professional` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "emailVerificationExpires",
ADD COLUMN     "emailVerificationExpires" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Professional" DROP COLUMN "emailVerificationExpires",
ADD COLUMN     "emailVerificationExpires" TIMESTAMP(3);
