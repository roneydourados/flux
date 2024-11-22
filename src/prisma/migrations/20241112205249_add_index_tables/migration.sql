-- CreateIndex
CREATE INDEX "category_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE INDEX "category_name_idx" ON "categories"("name");

-- CreateIndex
CREATE INDEX "transaction_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transaction_emission_date_idx" ON "transactions"("emission_date");

-- CreateIndex
CREATE INDEX "transaction_due_date_idx" ON "transactions"("due_date");

-- CreateIndex
CREATE INDEX "transaction_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transaction_down_transaction_id_idx" ON "transactions_down"("transaction_id");

-- CreateIndex
CREATE INDEX "transaction_down_payment_date_idx" ON "transactions_down"("payment_date");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "users"("email");
