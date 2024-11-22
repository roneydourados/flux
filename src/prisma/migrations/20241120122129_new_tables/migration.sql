/*
  Warnings:

  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `public_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to alter the column `icon` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `color` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to drop the column `createdAt` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `public_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `public_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `category_name` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "categories_public_id_key";

-- DropIndex
DROP INDEX "category_name_idx";

-- DropIndex
DROP INDEX "transactions_public_id_key";

-- DropIndex
DROP INDEX "users_public_id_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "public_id",
DROP COLUMN "updatedAt",
ADD COLUMN     "category_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publicId" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "icon" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "color" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "createdAt",
DROP COLUMN "public_id",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publicId" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "public_id",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publicId" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_price_id" TEXT,
ADD COLUMN     "stripe_subscription_id" TEXT,
ADD COLUMN     "stripe_subscription_status" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "publicId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER NOT NULL,
    "zip_code" VARCHAR(20) NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "complement" VARCHAR(200),
    "district" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "publicId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "observation" TEXT,
    "cnpj_cpf" VARCHAR(20),
    "type" CHAR(1) DEFAULT 'F',
    "is_active" BOOLEAN DEFAULT true,
    "hour_value_default" DECIMAL(18,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "publicId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "hour_value" DECIMAL(18,2) NOT NULL,
    "total_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(20),
    "task_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "task_end_date" DATE,
    "is_invoiced" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks_occurrences" (
    "id" SERIAL NOT NULL,
    "publicId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "task_id" INTEGER NOT NULL,
    "started" VARCHAR(20) NOT NULL,
    "ended" VARCHAR(20),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "address_user_id_idx" ON "address"("user_id");

-- CreateIndex
CREATE INDEX "address_category_idx" ON "address"("category");

-- CreateIndex
CREATE INDEX "client_idx_name" ON "clients"("name");

-- CreateIndex
CREATE INDEX "client_idx_user_id" ON "clients"("user_id");

-- CreateIndex
CREATE INDEX "task_idx_task_title" ON "tasks"("title");

-- CreateIndex
CREATE INDEX "task_idx_task_date" ON "tasks"("task_date");

-- CreateIndex
CREATE INDEX "task_idx_task_end_date" ON "tasks"("task_end_date");

-- CreateIndex
CREATE INDEX "task_idx_client_id" ON "tasks"("client_id");

-- CreateIndex
CREATE INDEX "task_idx_user_id" ON "tasks"("user_id");

-- CreateIndex
CREATE INDEX "task_ocorrence_idx_task_id" ON "tasks_occurrences"("task_id");

-- CreateIndex
CREATE INDEX "task_ocorrence_idx_started" ON "tasks_occurrences"("started");

-- CreateIndex
CREATE INDEX "task_ocorrence_idx_ended" ON "tasks_occurrences"("ended");

-- CreateIndex
CREATE INDEX "category_category_name_idx" ON "categories"("category_name");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_occurrences" ADD CONSTRAINT "tasks_occurrences_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
