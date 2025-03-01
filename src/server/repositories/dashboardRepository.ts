import prisma from "@/lib/prisma";
import {
  ServicesClientProps,
  TransactionCategoryProps,
} from "~/interfaces/Dashboard";

interface TransactionProps {
  total: number;
  type: string;
}

export const index = async (input: {
  userId: number;
  initialDate: string;
  finalDate: string;
}) => {
  const { calculeServiceTotals } = useServiceApiUtils();
  const { userId, initialDate, finalDate } = input;

  const gte = new Date(initialDate);
  const lte = new Date(finalDate);

  let totalServices = 0;
  let totalCredit = 0;
  let totalExpense = 0;
  let totalInvestment = 0;

  const transactions = await prisma.$queryRaw<TransactionProps[]>`
    select
      sum(t.amount) total,
      case 
        when t.type = 'EXPENSE' then 'Despesa'
        when t.type = 'CREDIT' then 'Receita'
        when t.type = 'INVESTMENT' then 'Investimento'
        else 'Outros'
      end as type
    from transactions t
    where t.user_id = ${userId}
      and t.due_date BETWEEN ${gte} and ${lte}
    group by t.type
  `;

  transactions.forEach((transaction) => {
    if (transaction.type === "Receita") {
      totalCredit = transaction.total;
    } else if (transaction.type === "Despesa") {
      totalExpense = transaction.total;
    } else if (transaction.type === "Investimento") {
      totalInvestment = transaction.total;
    }
  });

  const lastTransactions = await prisma.transaction.findMany({
    select: {
      amount: true,
      type: true,
      dueDate: true,
      Category: {
        select: {
          categoryName: true,
          icon: true,
          color: true,
        },
      },
    },
    where: {
      userId,
      dueDate: {
        gte,
        lte,
      },
    },
    orderBy: {
      id: "desc",
    },
    take: 5,
  });

  const services = await prisma.service.findMany({
    select: {
      id: true,
      serviceDate: true,
      hourValue: true,
      title: true,
      clientProjectId: true,
      Client: {
        select: {
          name: true,
        },
      },
      ServiceOccurrence: {
        select: {
          id: true,
          started: true,
          ended: true,
        },
      },
    },
    where: {
      userId,
      serviceDate: {
        gte,
        lte,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  services.forEach((service) => {
    totalServices =
      //@ts-ignore
      totalServices + Number(calculeServiceTotals(service).valorNumber ?? 0);
  });

  const lastServices = services
    .map((item) => {
      return {
        id: item.id,
        serviceDate: item.serviceDate,
        hourValue: item.hourValue,
        Client: item.Client,
        //@ts-ignore
        totalValue: Number(calculeServiceTotals(item).valorNumber ?? 0),
      };
    })
    .slice(0, 5);

  const transactionsCategories = await prisma.$queryRaw<
    TransactionCategoryProps[]
  >`
    select
      sum(t.amount) total,
      c.category_name category
    from transactions t 
    join categories c on c.id = t.category_id
        where t.user_id = ${userId}
          and t.due_date BETWEEN ${gte} and ${lte}
    group by  c.category_name
  `;

  const servicesClients = await prisma.$queryRaw<ServicesClientProps[]>`
    select
      cast(count(s.id) as integer) total,
      c.name client
    from services s  
    join clients c on c.id = s.client_id
    where s.user_id = ${userId}
      and s.service_date BETWEEN ${gte} and ${lte}
    group by  client
  `;

  return {
    totalCredit,
    totalExpense,
    totalInvestment,
    totalSalt: Number(
      Number(totalCredit) + Number(totalInvestment) - Number(totalExpense)
    ).toFixed(2),
    totalServices: totalServices.toFixed(2),
    lastTransactions,
    lastServices,
    transactionsCategories,
    servicesClients,
  };
};
