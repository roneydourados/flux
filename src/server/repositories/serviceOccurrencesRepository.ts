import { ServiceOccurrenceProps } from "~/interfaces/Service";
import prisma from "~/lib/prisma";

export const createTaskOccurrence = async ({
  serviceId,
  started,
}: ServiceOccurrenceProps) => {
  try {
    if (serviceId === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "serviceId is required",
      });
    }

    return prisma.serviceOccurrence.create({
      data: {
        serviceId,
        started: String(started!),
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao criar: ${error}`,
    });
  }
};

export const updateTaskOccurrence = async ({
  publicId,
  started,
  ended,
}: ServiceOccurrenceProps) => {
  try {
    const exists = await prisma.serviceOccurrence.findUnique({
      where: { publicId },
    });

    if (exists) {
      return prisma.serviceOccurrence.update({
        where: { id: exists.id },
        data: {
          started,
          ended,
        },
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao criar: ${error}`,
    });
  }
};

export const deleteTaskOccurrence = async (publicId: string) => {
  const { calculeServiceTotals } = useServiceApiUtils();

  try {
    const exists = await prisma.serviceOccurrence.findUnique({
      where: { publicId },
    });

    if (exists) {
      await prisma.serviceOccurrence.delete({
        where: { id: exists.id },
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
          //totalValue: true,
          userId: true,
          clientProjectId: true,
          ServiceOccurrence: {
            select: {
              id: true,
              createdAt: true,
              started: true,
              ended: true,
            },
          },
        },
        where: { id: exists.serviceId },
      });

      // if (serviceUpdateTotal) {
      //   //@ts-ignore calcular o total da task sempre que finalizar um evento de tempo
      //   const totalService = calculeServiceTotals(serviceUpdateTotal);

      //   await prisma.service.update({
      //     data: {
      //       totalValue: totalService.valorNumber.toFixed(2),
      //     },
      //     where: { id: serviceUpdateTotal.id },
      //   });
      // }
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao apagar: ${error}`,
    });
  }
};

export const getTaskOccurrences = async (serviceId: number) => {
  try {
    await prisma.serviceOccurrence.findMany({
      where: { serviceId },
    });
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao apagar: ${error}`,
    });
  }
};
