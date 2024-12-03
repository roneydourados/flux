import { ADDRESS_CLIENT } from "~/interfaces/Address";
import { ClientProps } from "~/interfaces/Client";
import prisma from "~/lib/prisma";

export const index = async (name?: string, userId?: number) => {
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      observation: true,
      cnpjCpf: true,
      isActive: true,
      type: true,
    },
    where: {
      name: name ? { contains: String(name), mode: "insensitive" } : undefined,
      userId,
    },
    orderBy: {
      id: "desc",
    },
  });

  return Promise.all(
    clients.map(async (client) => {
      const address = await prisma.address.findFirst({
        select: {
          id: true,
          street: true,
          category: true,
          complement: true,
          city: true,
          number: true,
          state: true,
          zipCode: true,
          ownerId: true,
        },
        where: {
          ownerId: client.id,
          category: ADDRESS_CLIENT,
        },
      });

      return { ...client, address };
    })
  );
};

export const show = async (publicId: string) => {
  const client = await prisma.client.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      observation: true,
      cnpjCpf: true,
      isActive: true,
      type: true,
    },
    where: {
      publicId,
    },
  });

  const address = await prisma.address.findFirst({
    select: {
      id: true,
      street: true,
      category: true,
      city: true,
      complement: true,
      district: true,
      number: true,
      state: true,
      publicId: true,
      zipCode: true,
      ownerId: true,
    },
    where: {
      ownerId: client?.id,
      category: ADDRESS_CLIENT,
    },
  });

  return { ...client, address };
};

export const create = async ({
  name,
  email,
  observation,
  phone,
  cnpjCpf,
  type,
  userId,
  address,
  hourValueDefault,
}: ClientProps) => {
  try {
    const client = await prisma.client.create({
      data: {
        name: String(name),
        cnpjCpf,
        type,
        email: email ? String(email) : undefined,
        observation: observation ? String(observation) : undefined,
        phone: phone ? String(phone) : undefined,
        userId: userId!,
        hourValueDefault: hourValueDefault ? Number(hourValueDefault) : 0,
      },
    });

    if (address) {
      await prisma.address.create({
        data: {
          ...address,
          zipCode: address.zipCode || "",
          street: address.street || "",
          number: address.number || "",
          complement: address.complement || "",
          district: address.district || "",
          city: address.city || "",
          state: address.state || "",
          userId: client.userId,
          ownerId: client.id,
          category: ADDRESS_CLIENT,
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

export const update = async ({
  id,
  publicId,
  name,
  email,
  observation,
  phone,
  cnpjCpf,
  type,
  address,
}: ClientProps) => {
  try {
    const exists = await prisma.client.findFirst({
      where: { publicId },
    });

    if (exists) {
      const client = await prisma.client.update({
        where: {
          id: exists.id,
        },
        data: {
          name,
          cnpjCpf,
          type,
          email: email ? String(email) : undefined,
          observation: observation ? String(observation) : undefined,
          phone: phone ? String(phone) : undefined,
        },
      });

      if (address) {
        const existsAddress = await prisma.address.findFirst({
          where: {
            ownerId: client.id,
            category: ADDRESS_CLIENT,
          },
        });

        if (existsAddress) {
          await prisma.address.update({
            data: {
              ...address,
              ...address,
              zipCode: address.zipCode || "",
              street: address.street || "",
              number: address.number || "",
              complement: address.complement || "",
              district: address.district || "",
              city: address.city || "",
              state: address.state || "",
              category: ADDRESS_CLIENT,
            },
            where: { id: existsAddress.id },
          });
        } else {
          await prisma.address.create({
            data: {
              ...address,
              zipCode: address.zipCode || "",
              street: address.street || "",
              number: address.number || "",
              complement: address.complement || "",
              district: address.district || "",
              city: address.city || "",
              state: address.state || "",
              userId: client.userId,
              ownerId: client.id,
              category: ADDRESS_CLIENT,
            },
          });
        }
      }

      return { ...client, address };
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
    const exists = await prisma.client.findFirst({
      where: { publicId },
    });

    if (exists) {
      await prisma.client.delete({
        where: { publicId },
      });

      await prisma.address.deleteMany({
        where: {
          ownerId: exists.id,
          category: ADDRESS_CLIENT,
        },
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao apagar: ${error}`,
    });
  }
};
