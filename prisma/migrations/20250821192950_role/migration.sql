/*
  Warnings:

  - Added the required column `role` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'COMPANY');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "role" "Role" NOT NULL;
