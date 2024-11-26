import prisma from "@/lib/prisma";
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";
import { TransactionProps } from "~/interfaces/Transaction";

export const index = async (input: {
  userId: number;
  initialDate: string;
  finalDate: string;
  status?: string;
}) => {
  const { finalDate, initialDate, userId, status } = input;

  const gte = initialDate ? new Date(String(initialDate)) : new Date();
  const lte = finalDate ? new Date(String(finalDate)) : new Date();

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
