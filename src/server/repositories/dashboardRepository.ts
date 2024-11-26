import prisma from "@/lib/prisma";

interface ChartMonthProps {
  month_abbr?: string;
  total_expense: number;
  total_investment: number;
  total_credit: number;
}

export const chartMonthTransactions = async (input: {
  year?: number;
  userId: number;
}) => {
  const { year, userId } = input;

  const currentYear = year || new Date().getFullYear();

  const inititalDate = `${currentYear}-01-01`;
  const finalDate = `${currentYear}-12-31`;

  const data = await prisma.$queryRaw<ChartMonthProps[]>`
    WITH transaction_fin AS (
        SELECT
            EXTRACT(MONTH FROM t.due_date) AS month_num,
            CASE
                WHEN t.type = 'EXPENSE' THEN t.amount
                ELSE 0
            END AS expense,
            CASE
                WHEN t.type = 'INVESTMENT' THEN t.amount
                ELSE 0
            END AS investment,
            CASE
                WHEN t.type = 'CREDIT' THEN t.amount
                ELSE 0
            END AS credit
        FROM transactions t
        WHERE t.user_id = ${userId}
          AND t.due_date BETWEEN ${new Date(inititalDate)} AND ${new Date(
    finalDate
  )}
    )
    SELECT
        CASE
            WHEN month_num = 1 THEN 'Jan'
            WHEN month_num = 2 THEN 'Fev'
            WHEN month_num = 3 THEN 'Mar'
            WHEN month_num = 4 THEN 'Abr'
            WHEN month_num = 5 THEN 'Mai'
            WHEN month_num = 6 THEN 'Jun'
            WHEN month_num = 7 THEN 'Jul'
            WHEN month_num = 8 THEN 'Ago'
            WHEN month_num = 9 THEN 'Set'
            WHEN month_num = 10 THEN 'Out'
            WHEN month_num = 11 THEN 'Nov'
            WHEN month_num = 12 THEN 'Dez'
        END AS month_abbr,
        SUM(expense) AS total_expense,
        SUM(investment) AS total_investment,
        SUM(credit) AS total_credit
    FROM transaction_fin
    GROUP BY month_num
    ORDER BY month_num;
`;

  return data.map((item: ChartMonthProps) => {
    return {
      month: item.month_abbr,
      expense: item.total_expense,
      investment: item.total_investment,
      credit: item.total_credit,
    };
  });
};
