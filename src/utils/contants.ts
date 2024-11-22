export const paymentForms = [
  {
    type: "CREDIT_CARD",
    name: "Cartão Crédito",
    icon: "mdi-credit-card-outline",
  },
  {
    type: "DEBIT_CARD",
    name: "Cartão Débito",
    icon: "mdi-credit-card-outline",
  },
  {
    type: "BANK_TRANSFER",
    name: "Transferência Bancária",
    icon: "mdi-bank-transfer",
  },
  {
    type: "BANK_SLIP",
    name: "Boleto",
    icon: "mdi-barcode",
  },
  {
    type: "CASH",
    name: "Dinheiro",
    icon: "mdi-cash-multiple",
  },
  {
    type: "PIX",
    name: "Pix",
    icon: "mdi-dots-hexagon",
  },
  {
    type: "OTHER",
    name: "Outros",
    icon: "mdi-qrcode-scan",
  },
];

export const transactionTypes = [
  {
    name: "Crédito",
    type: "CREDIT",
  },
  {
    name: "Débito",
    type: "EXPENSE",
  },
  {
    name: "Investimento",
    type: "INVESTMENT",
  },
];
