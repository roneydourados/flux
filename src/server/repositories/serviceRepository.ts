import { ServiceProps } from "~/interfaces/Service";
import prisma from "~/lib/prisma";
import { useServiceApiUtils } from "../utils/ApiUtils";

interface FiltersProps {
  initialDate?: string;
  finalDate?: string;
  clientProjectId?: number;
  clientId?: number;
  invoiced?: string;
  userId?: number;
  ownerId?: number;
}

export const index = async ({
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

  const services = await prisma.service.findMany({
    select: {
      id: true,
      publicId: true,
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
          publicId: true,
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
          publicId: true,
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
      isInvoiced,
      userId: Number(userId),
    },
  });

  const returnServices = await Promise.all(
    services.map(async (service) => {
      const lastOpenOccurence = await getLastOpenOcurrence(service.id);
      return {
        lastOpenOccurence: lastOpenOccurence?.started
          ? lastOpenOccurence?.started
          : null,
        ...service,
      };
    })
  );

  return returnServices;
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

export const create = async ({
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

export const update = async ({
  publicId,
  status,
  clientProjectId,
  hourValue,
  title,
  serviceDate,
  serviceEndDate,
  updateOccorrence,
  totalValue,
  isInvoiced,
  occurrenceStartDate,
  occurrenceEndDate,
}: ServiceProps) => {
  const { calculeServiceTotals } = useServiceApiUtils();

  try {
    const exists = await prisma.service.findFirst({
      where: {
        publicId,
      },
    });

    if (exists) {
      const data = {
        status,
        clientProjectId, // Add the missing property
        hourValue,
        totalValue,
        title,
        serviceDate: serviceDate ? new Date(String(serviceDate)) : undefined,
        serviceEndDate: serviceEndDate
          ? new Date(String(serviceEndDate))
          : null,
        isInvoiced,
      };

      // aqui significa que vou reabrir o serviço então setar null na data final
      if (status === "STOPPED") {
        data.serviceEndDate = null;
      }

      const service = await prisma.service.update({
        where: { id: exists.id },
        data,
      });

      if (updateOccorrence) {
        if (status === "STOPPED") {
          const lastOccurrence = await prisma.serviceOccurrence.findFirst({
            where: {
              serviceId: exists.id,
              ended: null,
            },
            orderBy: {
              started: "desc",
            },
          });

          if (lastOccurrence) {
            await prisma.serviceOccurrence.update({
              where: { id: lastOccurrence.id },
              data: {
                ended: occurrenceEndDate,
              },
            });

            const serviceUpdateTotal = await prisma.service.findFirst({
              select: {
                id: true,
                hourValue: true,
                status: true,
                createdAt: true,
                serviceDate: true,
                title: true,
                serviceEndDate: true,
                totalValue: true,
                userId: true,
                ServiceOccurrence: {
                  select: {
                    id: true,
                    createdAt: true,
                    ended: true,
                    started: true,
                  },
                },
              },
              where: { id: exists.id },
            });

            //@ts-ignore calcular o total do serviço sempre que finalizar um evento de tempo
            const totalService = calculeServiceTotals(serviceUpdateTotal);

            await prisma.service.update({
              data: {
                totalValue: totalService.valorNumber.toFixed(2),
              },
              where: { id: serviceUpdateTotal?.id },
            });
          }
        } else {
          await prisma.serviceOccurrence.create({
            data: {
              serviceId: exists.id,
              started: occurrenceStartDate!,
            },
          });
        }
      }

      return service;
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao atualizar: ${error}`,
    });
  }
};

export const destroy = async (publicId: string) => {
  try {
    const exists = await prisma.service.findFirst({
      where: { publicId },
    });

    if (exists) {
      await prisma.service.delete({
        where: { id: exists.id },
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao apagar: ${error}`,
    });
  }
};
