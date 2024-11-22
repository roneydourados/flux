/*
  Warnings:

  - You are about to alter the column `public_id` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `public_id` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `public_id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "public_id" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "public_id" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "public_id" SET DATA TYPE VARCHAR(50);
