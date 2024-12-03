/*
  Warnings:

  - Added the required column `owner_id` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "owner_id" INTEGER NOT NULL;
