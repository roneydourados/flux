export interface TransactionProps {
  id?: number;
  userId?: number;
  categoryId?: number;
  portion?: number;
  portionTotal?: number;
  emisstionDate?: string;
  dueDate?: string;
  title?: string;
  amount?: number;
  status?: string;
  fixed?: boolean;
  type?: string;
  publicId?: string;
  paymentForm?: string;
  createdAt?: string;
  updatedAt?: string;
  Category?: CategoryProps;
  User?: UserProps;
}
