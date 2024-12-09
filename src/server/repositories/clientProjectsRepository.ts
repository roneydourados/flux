import prisma from "@/lib/prisma";
import { ClientProjectProps } from "@/interfaces/ClientProjects";

export const createClientProject = async ({
  clientId,
  name,
  color,
}: ClientProjectProps) => {
  try {
    return prisma.clientProject.create({
      data: {
        name,
        clientId: clientId!,
        color,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao criar projeto: ${error}`,
    });
  }
};

export const showClientProject = async (publicId: string) => {
  return prisma.clientProject.findFirst({
    select: {
      id: true,
      name: true,
      clientId: true,
      color: true,
      Client: {
        select: {
          id: true,
          name: true,
          hourValueDefault: true,
        },
      },
    },
    where: {
      publicId,
    },
  });
};

export const indexClientProjects = async (
  clientId?: number,
  name?: string,
  userId?: number
) => {
  return prisma.clientProject.findMany({
    select: {
      id: true,
      clientId: true,
      name: true,
      color: true,
      Client: {
        select: {
          id: true,
          name: true,
          hourValueDefault: true,
        },
      },
    },
    where: {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      clientId: clientId ? { equals: clientId } : undefined,
      Client: {
        userId: userId!,
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const updateClientProject = async ({
  name,
  color,
  publicId,
}: ClientProjectProps) => {
  try {
    const exists = await prisma.clientProject.findFirst({
      where: { publicId },
    });

    if (exists) {
      return prisma.clientProject.update({
        where: { id: exists.id },
        data: { name, color },
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao Atualizar: ${error}`,
    });
  }
};

export const deleteClientProject = async (publicId: string) => {
  try {
    const exists = await prisma.clientProject.findFirst({
      where: { publicId },
    });

    if (exists) {
      await prisma.clientProject.delete({
        where: { id: exists.id },
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Erro ao Deletar: ${error}`,
    });
  }
};
