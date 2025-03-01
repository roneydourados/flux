export interface DashboardProps {
  totalCredit: number;
  totalExpense: number;
  totalInvestment: number;
  totalSalt: number;
  totalServices: number;
  lastTransactions: TransactionProps[];
  lastServices: ServiceProps[];
  transactionsCategories: TransactionCategoryProps[];
  servicesClients: ServicesClientProps[];
}

export interface TransactionCategoryProps {
  total: number;
  category: string;
}

export interface ServicesClientProps {
  total: number;
  client: string;
}
