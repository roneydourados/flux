/*
  Warnings:

  - You are about to drop the column `publicId` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `tasks_occurrences` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_id]` on the table `address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `tasks_occurrences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "address_publicId_key";

-- DropIndex
DROP INDEX "categories_publicId_key";

-- DropIndex
DROP INDEX "clients_publicId_key";

-- DropIndex
DROP INDEX "tasks_publicId_key";

-- DropIndex
DROP INDEX "tasks_occurrences_publicId_key";

-- DropIndex
DROP INDEX "transactions_publicId_key";

-- AlterTable
ALTER TABLE "address" DROP COLUMN "publicId",
ADD COLUMN     "public_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "publicId",
ADD COLUMN     "public_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "publicId",
ADD COLUMN     "public_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "publicId",
ADD COLUMN     "public_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "tasks_occurrences" DROP COLUMN "publicId",
ADD COLUMN     "public_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "publicId",
ADD COLUMN     "public_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "address_public_id_key" ON "address"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_public_id_key" ON "categories"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_public_id_key" ON "clients"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_public_id_key" ON "tasks"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_occurrences_public_id_key" ON "tasks_occurrences"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_public_id_key" ON "transactions"("public_id");
