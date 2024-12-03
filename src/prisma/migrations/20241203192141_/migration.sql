/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `clients_projects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "clients_projects" ADD COLUMN     "public_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "clients_projects_public_id_key" ON "clients_projects"("public_id");
