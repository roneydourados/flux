/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `tasks_occurrences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "icon" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "color" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "category_name" SET DATA TYPE VARCHAR(200);

-- CreateIndex
CREATE UNIQUE INDEX "address_publicId_key" ON "address"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_publicId_key" ON "categories"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_publicId_key" ON "clients"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_publicId_key" ON "tasks"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_occurrences_publicId_key" ON "tasks_occurrences"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_publicId_key" ON "transactions"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "users_publicId_key" ON "users"("publicId");
