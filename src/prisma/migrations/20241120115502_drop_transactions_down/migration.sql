/*
  Warnings:

  - You are about to drop the `transactions_down` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions_down" DROP CONSTRAINT "transactions_down_transaction_id_fkey";

-- DropTable
DROP TABLE "transactions_down";
