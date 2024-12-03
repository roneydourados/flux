import { ServiceProps } from "~/interfaces/Service";
import prisma from "~/lib/prisma";

interface FiltersProps {
  initialDate?: string;
  finalDate?: string;
  clientProjectId?: number;
  clientId?: number;
  invoiced?: string;
  userId?: number;
  ownerId?: number;
}

export const getTasks = async ({
  clientId,
  clientProjectId,
  finalDate,
  initialDate,
  invoiced,
  userId,
}: FiltersProps) => {
  let isInvoiced: boolean | undefined;

  if (invoiced === "Faturadas") {
    isInvoiced = true;
  } else if (invoiced === "Não Faturadas") {
    isInvoiced = false;
  } else if (invoiced === "Todas") {
    isInvoiced = undefined;
  }

  const gte = initialDate ? new Date(String(initialDate)) : new Date();
  const lte = finalDate ? new Date(String(finalDate)) : new Date();

  const tasks = await prisma.service.findMany({
    select: {
      id: true,
      title: true,
      hourValue: true,
      clientProjectId: true,
      createdAt: true,
      serviceDate: true,
      serviceEndDate: true,
      status: true,
      isInvoiced: true,
      clientId: true,
      userId: true,
      totalValue: true,
      _count: {
        select: {
          ServiceOccurrence: true,
        },
      },
      ServiceOccurrence: {
        select: {
          id: true,
          started: true,
          ended: true,
        },
        orderBy: {
          id: "desc",
        },
      },
      ClientProject: {
        select: {
          id: true,
          clientId: true,
          name: true,
          color: true,
          Client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
    where: {
      serviceDate: {
        gte,
        lte,
      },
      clientProjectId: clientProjectId ? Number(clientProjectId) : undefined,
      clientId: clientId ? Number(clientId) : undefined,
      //ownerId: ownerId ? Number(ownerId) : Number(userId),

      isInvoiced,
      userId: Number(userId),
    },
  });

  const returnTasks = await Promise.all(
    tasks.map(async (task) => {
      const lastOpenOccurence = await getLastOpenOcurrence(task.id);
      return {
        lastOpenOccurence: lastOpenOccurence?.started
          ? lastOpenOccurence?.started
          : null,
        ...task,
      };
    })
  );

  return returnTasks;
};

const getLastOpenOcurrence = async (serviceId: number) => {
  return prisma.serviceOccurrence.findFirst({
    select: {
      id: true,
      started: true,
      ended: true,
    },
    where: {
      serviceId,
      ended: null,
    },
    orderBy: {
      started: "desc",
    },
  });
};

export const createTask = async ({
  title,
  hourValue,
  clientProjectId,
  clientId,
  userId,
}: ServiceProps) => {
  try {
    let status = "STOPPED";

    return await prisma.service.create({
      data: {
        hourValue: Number(hourValue),
        title,
        clientProjectId: Number(clientProjectId),
        clientId: Number(clientId),
        userId: Number(userId!),
        status,
        serviceDate: new Date(),
        totalValue: 0,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao criar: ${error}`,
    });
  }
};
