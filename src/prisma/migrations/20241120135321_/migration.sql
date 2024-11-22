/*
  Warnings:

  - Added the required column `client_project_id` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "client_project_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "client_projects" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "color" VARCHAR(20) NOT NULL,

    CONSTRAINT "client_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "client_projects_idx_name" ON "client_projects"("name");

-- AddForeignKey
ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_client_project_id_fkey" FOREIGN KEY ("client_project_id") REFERENCES "client_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
