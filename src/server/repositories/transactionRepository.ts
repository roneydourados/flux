import prisma from "@/lib/prisma";
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";
import moment from "moment";
import { TransactionProps } from "~/interfaces/Transaction";

interface ChartMonthProps {
  month_abbr?: string;
  total_expense: number;
  total_investment: number;
  total_credit: number;
  day_of_month?: string;
}

export const index = async (input: {
  userId: number;
  initialDate: string;
  finalDate: string;
  status?: string;
}) => {
  const { finalDate, initialDate, userId, status } = input;

  const gte = initialDate ? new Date(initialDate) : new Date();
  const lte = finalDate ? new Date(finalDate) : new Date();

  const transactions = await prisma.transaction.findMany({
    select: {
      publicId: true,
      id: true,
      amount: true,
      categoryId: true,
      title: true,
      emisstionDate: true,
      dueDate: true,
      type: true,
      createdAt: true,
      fixed: true,
      portion: true,
      portionTotal: true,
      status: true,
      paymentMethod: true,
      Category: {
        select: {
          color: true,
          icon: true,
          id: true,
          categoryName: true,
        },
      },
    },
    where: {
      userId,
      status,
      dueDate: {
        gte,
        lte,
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  return transactions;
};

export const create = async ({
  categoryId,
  amount,
  dueDate,
  emisstionDate,
  fixed,
  title,
  paymentMethod,
  portion,
  portionTotal,
  type,
  userId,
}: TransactionProps) => {
  try {
    if (portionTotal! === 1) {
      //parcela única
      await prisma.transaction.create({
        data: {
          categoryId: categoryId!,
          amount: Number(amount),
          dueDate: new Date(dueDate!),
          emisstionDate: new Date(emisstionDate!),
          fixed: fixed!,
          title: String(title),
          portion: portion!,
          portionTotal: portionTotal!,
          type: type as TransactionType,
          userId: userId!,
          paymentMethod: paymentMethod as TransactionPaymentMethod,
        },
      });
    } else {
      // parcelado
      let currentDue = dueDate!;

      for (let i = 1; i <= portionTotal!; i++) {
        if (i > 1) {
          currentDue = moment(currentDue).add(1, "months").format("YYYY-MM-DD");
        }

        await prisma.transaction.create({
          data: {
            categoryId: categoryId!,
            amount: Number(amount),
            dueDate: new Date(currentDue),
            emisstionDate: new Date(emisstionDate!),
            fixed: fixed!,
            title: String(title),
            portion: i,
            portionTotal: portionTotal!,
            type: type as TransactionType,
            userId: userId!,
            paymentMethod: paymentMethod as TransactionPaymentMethod,
          },
        });
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Transaction creation failed",
    });
  }
};

export const update = async ({
  publicId,
  categoryId,
  amount,
  dueDate,
  emisstionDate,
  fixed,
  title,
  paymentMethod,
  type,
  status,
}: TransactionProps) => {
  const transaction = await exists(publicId!);

  try {
    await prisma.transaction.update({
      data: {
        categoryId: categoryId!,
        amount: Number(amount),
        dueDate: new Date(dueDate!),
        emisstionDate: new Date(emisstionDate!),
        fixed: fixed!,
        title: String(title),
        type: type as TransactionType,
        paymentMethod: paymentMethod as TransactionPaymentMethod,
        status,
      },
      where: {
        id: transaction.id,
      },
    });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Transaction update failed",
    });
  }
};

export const destroy = async (publicId: string) => {
  const transaction = await exists(publicId);

  try {
    //verificar se existe serviço vinculado a transação a ser apagada
    const service = await prisma.service.findFirst({
      where: {
        financeOwner: transaction.publicId,
      },
    });

    //caso exista serviço vinculado então remover faturamento do mesmo
    if (service) {
      await prisma.service.updateMany({
        where: {
          financeOwner: transaction.publicId,
        },
        data: {
          financeOwner: null,
          isInvoiced: false,
        },
      });
    }

    await prisma.transaction.delete({
      where: {
        id: transaction.id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Transaction deletion failed",
    });
  }
};

export const show = async (publicId: string) => {
  return exists(publicId);
};

const exists = async (publicId: string) => {
  const transaction = await prisma.transaction.findFirst({
    select: {
      publicId: true,
      id: true,
      amount: true,
      categoryId: true,
      title: true,
      emisstionDate: true,
      dueDate: true,
      type: true,
      createdAt: true,
      fixed: true,
      portion: true,
      status: true,
      paymentMethod: true,
      Category: {
        select: {
          color: true,
          icon: true,
          id: true,
          categoryName: true,
        },
      },
    },
    where: {
      publicId,
    },
  });

  if (!transaction) {
    throw createError({
      statusCode: 404,
      statusMessage: "Transaction not found",
    });
  }

  return transaction;
};

export const chartMonthDays = async (input: {
  month?: number;
  year?: number;
  userId: number;
}) => {
  const { month, year, userId } = input;

  const currentYear = year || new Date().getFullYear();
  const currentMonth = month || new Date().getMonth() + 1;

  const inititalDate = moment(`${currentYear}-${currentMonth}-01`)
    .startOf("month")
    .format("YYYY-MM-DD");

  const finalDate = moment(`${currentYear}-${currentMonth}-01`)
    .endOf("month")
    .format("YYYY-MM-DD");

  const data = await prisma.$queryRaw<ChartMonthProps[]>`
    WITH transaction_fin AS (
        SELECT
            EXTRACT(DAY FROM t.due_date) AS day_num,
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
        LPAD(day_num::TEXT, 2, '0') AS day_of_month,
        SUM(expense) AS total_expense,
        SUM(investment) AS total_investment,
        SUM(credit) AS total_credit
    FROM transaction_fin
    GROUP BY day_num
    ORDER BY day_num;
  `;

  return data.map((item: ChartMonthProps) => {
    return {
      day: item.day_of_month,
      expense: item.total_expense,
      investment: item.total_investment,
      credit: item.total_credit,
    };
  });
};
