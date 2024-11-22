import { CategoryProps } from "~/interfaces/Category";
import prisma from "~/lib/prisma";

export const getCategories = async (userId: number, name?: string) => {
  const categories = await prisma.category.findMany({
    where: {
      userId,
      categoryName: {
        contains: name,
        mode: "insensitive",
      },
    },
  });

  return categories;
};

export const create = async (payload: CategoryProps) => {
  const { color, icon, categoryName, userId } = payload;

  try {
    return prisma.category.create({
      data: {
        color: color ? color : "",
        icon: icon ? icon : "mdi-cursor-default-gesture-outline",
        categoryName: categoryName!,
        userId: userId!,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Category creation failed",
    });
  }
};

export const update = async (payload: CategoryProps) => {
  const { color, icon, categoryName, id } = payload;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: id!,
      },
    });

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: "Category not found",
      });
    }

    return prisma.category.update({
      data: {
        color: color ? color : "",
        icon: icon ? icon : "mdi-cursor-default-gesture-outline",
        categoryName: categoryName!,
      },
      where: {
        id: category.id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Category update failed",
    });
  }
};

export const show = async (publicId: string) => {
  const category = await prisma.category.findFirst({
    where: {
      publicId,
    },
  });

  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: "Category not found",
    });
  }

  return category;
};

export const destroy = async (publicId: string) => {
  const exists = await show(publicId);
  try {
    await prisma.category.delete({
      where: {
        id: exists.id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Category deletion failed",
    });
  }
};
