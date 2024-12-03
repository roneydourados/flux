/*
  Warnings:

  - You are about to drop the `tasks_occurrences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks_occurrences" DROP CONSTRAINT "tasks_occurrences_task_id_fkey";

-- DropTable
DROP TABLE "tasks_occurrences";

-- CreateTable
CREATE TABLE "services_occurrences" (
    "id" SERIAL NOT NULL,
    "public_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "service_id" INTEGER NOT NULL,
    "started" VARCHAR(20) NOT NULL,
    "ended" VARCHAR(20),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_occurrences_public_id_key" ON "services_occurrences"("public_id");

-- CreateIndex
CREATE INDEX "service_ocorrence_idx_service_id" ON "services_occurrences"("service_id");

-- CreateIndex
CREATE INDEX "service_ocorrence_idx_started" ON "services_occurrences"("started");

-- CreateIndex
CREATE INDEX "service_ocorrence_idx_ended" ON "services_occurrences"("ended");

-- AddForeignKey
ALTER TABLE "services_occurrences" ADD CONSTRAINT "services_occurrences_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "task_idx_client_id" RENAME TO "service_idx_client_id";

-- RenameIndex
ALTER INDEX "task_idx_task_date" RENAME TO "service_idx_service_date";

-- RenameIndex
ALTER INDEX "task_idx_task_end_date" RENAME TO "service_idx_service_end_date";

-- RenameIndex
ALTER INDEX "task_idx_task_title" RENAME TO "service_idx_service_title";

-- RenameIndex
ALTER INDEX "task_idx_user_id" RENAME TO "service_idx_user_id";
