/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `payment_method` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "paymentMethod",
ADD COLUMN     "payment_method" "TransactionPaymentMethod" NOT NULL;
