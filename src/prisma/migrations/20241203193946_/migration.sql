/*
  Warnings:

  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "services_occurrences" DROP CONSTRAINT "services_occurrences_service_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_client_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_client_project_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_fkey";

-- DropTable
DROP TABLE "tasks";

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "public_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "client_project_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "hour_value" DECIMAL(18,2) NOT NULL,
    "total_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(20),
    "service_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "service_end_date" DATE,
    "is_invoiced" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_public_id_key" ON "services"("public_id");

-- CreateIndex
CREATE INDEX "service_idx_service_title" ON "services"("title");

-- CreateIndex
CREATE INDEX "service_idx_service_date" ON "services"("service_date");

-- CreateIndex
CREATE INDEX "service_idx_service_end_date" ON "services"("service_end_date");

-- CreateIndex
CREATE INDEX "service_idx_client_id" ON "services"("client_id");

-- CreateIndex
CREATE INDEX "service_idx_user_id" ON "services"("user_id");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_client_project_id_fkey" FOREIGN KEY ("client_project_id") REFERENCES "clients_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_occurrences" ADD CONSTRAINT "services_occurrences_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
