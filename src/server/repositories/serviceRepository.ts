import { ServiceProjectProps, ServiceProps } from "~/interfaces/Service";
import { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";
//import { useServiceApiUtils } from "../utils/ApiUtils";
import { TransactionPaymentMethod } from "@prisma/client";
import { uuidv7 } from "uuidv7";
//import dayjs from "dayjs";

interface FiltersProps {
  initialDate?: string;
  finalDate?: string;
  clientProjectId?: number;
  clientId?: number;
  invoiced?: string;
  userId?: number;
  ownerId?: number;
}

interface ServiceInvoiceProps {
  day_month: number;
  total: number;
}

export const index = async ({
  clientId,
  clientProjectId,
  finalDate,
  initialDate,
  invoiced,
  userId,
}: FiltersProps) => {
  let isInvoiced = undefined;
  let invoicedWhere = Prisma.empty;

  if (invoiced === "Faturadas") {
    isInvoiced = true;
    invoicedWhere = Prisma.sql`and s.is_invoiced = ${isInvoiced}`;
  } else if (invoiced === "Não Faturadas") {
    isInvoiced = false;
    invoicedWhere = Prisma.sql`and s.is_invoiced = ${isInvoiced}`;
  }

  const gte = initialDate ? new Date(initialDate) : new Date();
  const lte = finalDate ? new Date(finalDate) : new Date();

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

  const servicesProjects = await prisma.$queryRaw<ServiceProjectProps[]>`
    select 
      p.name project,
      cast(count(s.id) as integer) as total
    from services s
    join clients_projects p on p.id = s.client_project_id
    where s.user_id = ${userId}
      and s.service_date BETWEEN ${gte} and ${lte}
      ${clientId ? Prisma.sql`and s.client_id = ${clientId}` : Prisma.empty}
      ${invoicedWhere}
      group by p.name
  `;

  return {
    returnServices,
    servicesProjects,
  };
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
      },
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao criar serviço",
    });
  }
};

export const update = async ({
  publicId,
  status,
  clientProjectId,
  hourValue,
  title,
  //serviceDate,
  serviceEndDate,
  updateOccorrence,
  isInvoiced,
  occurrenceStartDate,
  occurrenceEndDate,
}: ServiceProps) => {
  //const { calculeServiceTotals } = useServiceApiUtils();

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
        title,
        //serviceDate: serviceDate ? new Date(String(serviceDate)) : undefined,
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

            // //@ts-ignore calcular o total do serviço sempre que finalizar um evento de tempo
            // const totalService = calculeServiceTotals(serviceUpdateTotal);

            // await prisma.service.update({
            //   data: {
            //     totalValue: totalService.valorNumber.toFixed(2),
            //   },
            //   where: { id: serviceUpdateTotal?.id },
            // });
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

export const invoiceServices = async (input: {
  initialDate: string;
  finalDate: string;
  dueDate: string;
  clientId: number;
  invoiced: boolean;
  userId: number;
  categoryId?: number;
  paymentMethod?: string;
  total: number;
}) => {
  const {
    clientId,
    finalDate,
    initialDate,
    invoiced,
    userId,
    categoryId,
    paymentMethod,
    total,
    dueDate,
  } = input;

  try {
    // se for para faturar então criar uma transação
    if (invoiced) {
      if (!total || total <= 0) {
        // se não encontrar total então não fazer nada
        throw createError({
          statusCode: 404,
          statusMessage: "Informe o valor total para faturar",
        });
      }

      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
        },
      });

      // const dueDatedayjsLocal = dayjs(dueDate, "YYYY-MM-DD");
      // const dueDateJS = dueDatedayjsLocal.toDate();

      // Zerar as horas para garantir que estamos no início do dia
      // dueDateJS.setHours(12, 10, 0, 0);

      // console.log("🚀 ~ dueDateJS:", dueDateJS);

      const transaction = await prisma.transaction.create({
        data: {
          categoryId: categoryId!,
          amount: Number(total),
          dueDate: new Date(dueDate),
          emisstionDate: new Date(),
          fixed: false,
          title: `Faturamento de serviços, cliente: ${client?.name}`,
          portion: 1,
          portionTotal: 1,
          type: "CREDIT",
          userId: userId,
          paymentMethod: paymentMethod as TransactionPaymentMethod,
          publicId: uuidv7(),
        },
      });

      await prisma.service.updateMany({
        where: {
          clientId,
          userId,
          serviceDate: {
            gte: new Date(initialDate),
            lte: new Date(finalDate),
          },
        },
        data: {
          status: "FINISHED",
          isInvoiced: invoiced,
          financeOwner: transaction.publicId,
        },
      });
    } else {
      //pegar um registro para apagar a transação
      const service = await prisma.service.findFirst({
        where: {
          clientId,
          userId,
          status: "FINISHED",
          serviceDate: {
            gte: new Date(initialDate),
            lte: new Date(finalDate),
          },
        },
      });

      if (!service || !service.financeOwner) {
        //caso não enocntre o serviço ou não tenha transação então não fazer nada
        return;
      }

      // apagar transação caso exista
      await prisma.transaction.delete({
        where: {
          publicId: service.financeOwner,
        },
      });

      await prisma.service.updateMany({
        where: {
          financeOwner: service.financeOwner,
        },
        data: {
          isInvoiced: invoiced,
          financeOwner: null,
        },
      });
    }
  } catch (error) {
    console.log("🚀 ~ error invoice services:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao faturar serviços",
    });
  }
};
