export interface DashboardProps {
  totalCredit: number;
  totalExpense: number;
  totalInvestment: number;
  totalSalt: number;
  totalServices: number;
  lastTransactions: TransactionProps[];
  lastServices: ServiceProps[];
}
