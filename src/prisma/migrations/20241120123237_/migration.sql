/*
  Warnings:

  - You are about to drop the column `name` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - A unique constraint covering the columns `[public_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_publicId_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "publicId",
ADD COLUMN     "public_id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200);

-- CreateIndex
CREATE UNIQUE INDEX "users_public_id_key" ON "users"("public_id");
