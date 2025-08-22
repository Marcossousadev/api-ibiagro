-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "companyId" TEXT;

-- CreateTable
CREATE TABLE "StudentProfessional" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentProfessional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfessional_studentId_professionalId_key" ON "StudentProfessional"("studentId", "professionalId");

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfessional" ADD CONSTRAINT "StudentProfessional_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfessional" ADD CONSTRAINT "StudentProfessional_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
