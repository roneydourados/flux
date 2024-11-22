/*
  Warnings:

  - You are about to drop the `client_projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "client_projects" DROP CONSTRAINT "client_projects_client_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_client_project_id_fkey";

-- DropTable
DROP TABLE "client_projects";

-- CreateTable
CREATE TABLE "clients_projects" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "color" VARCHAR(20) NOT NULL,

    CONSTRAINT "clients_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "client_projects_idx_name" ON "clients_projects"("name");

-- AddForeignKey
ALTER TABLE "clients_projects" ADD CONSTRAINT "clients_projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_client_project_id_fkey" FOREIGN KEY ("client_project_id") REFERENCES "clients_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
