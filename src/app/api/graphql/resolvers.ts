import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getServerSession, Session } from "next-auth";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { req }: { req: any }) => {
      const session: Session | null = await getServerSession(req);
      if (!session) {
        throw new Error("Not authenticated");
      }
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email! },
      });
      return user;
    },
    users: async () => prisma.user.findMany(),
    categories: async () =>
      prisma.category.findMany({
        include: { products: true, discountEvents: true },
      }),
    products: async () =>
      prisma.product.findMany({
        include: { category: true, discountEvents: true },
      }),
    discountEvents: async () =>
      prisma.discountEvent.findMany({
        include: { products: true, categories: true },
      }),
    category: async (_: any, { id }: { id: number }) =>
      prisma.category.findUnique({
        where: { id },
        include: { products: true, discountEvents: true },
      }),
    product: async (_: any, { id }: { id: number }) =>
      prisma.product.findUnique({
        where: { id },
        include: { category: true, discountEvents: true },
      }),
    discountEvent: async (_: any, { id }: { id: number }) =>
      prisma.discountEvent.findUnique({
        where: { id },
        include: { products: true, categories: true },
      }),
  },
  Mutation: {
    createUser: async (
      _: any,
      {
        email,
        name,
        password,
        imageUrl,
      }: { email: string; name: string; password: string; imageUrl: string }
    ) => {
      const hashedPassword = bcrypt.hashSync(password, 12);
      return prisma.user.create({
        data: { email, name, password: hashedPassword, imageUrl },
      });
    },
    createCategory: async (
      _: any,
      { name, imageUrl }: { name: string; imageUrl: string }
    ) => {
      return prisma.category.create({
        data: { name, imageUrl },
      });
    },
    createProduct: async (
      _: any,
      { name, description, price, thumbnail, images, categoryId }: any
    ) => {
      return prisma.product.create({
        data: { name, description, price, thumbnail, images, categoryId },
      });
    },
    createDiscountEvent: async (
      _: any,
      { discountPercentage, startDate, endDate, productIds, categoryIds }: any
    ) => {
      return prisma.discountEvent.create({
        data: {
          discountPercentage,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          products: {
            connect: productIds.map((id: number) => ({ id })),
          },
          categories: {
            connect: categoryIds.map((id: number) => ({ id })),
          },
        },
      });
    },
  },
};
