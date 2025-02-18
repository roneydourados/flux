-- AlterTable
ALTER TABLE "services" ADD COLUMN     "finance_owner" VARCHAR(40);

-- CreateIndex
CREATE INDEX "service_idx_finance_owner" ON "services"("finance_owner");
