"use server";

import { client } from "@/lib/prisma";

export const findUser = async (clerkId: string) => {
  try {
    return await client.user.findUnique({
      where: {
        clerkId,
      },
      include: {
        subscription: true,
        integrations: {
          select: {
            id: true,
            token: true,
            expiresAt: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};

export const createUser = async (
  clerkId: string,
  firstname: string,
  lastname: string,
  email: string
) => {
  try {
    // Check if user already exists to avoid duplicates
    const existingUser = await client.user.findUnique({
      where: { clerkId },
    });
    
    if (existingUser) {
      console.log(`User with clerkId ${clerkId} already exists`);
      return existingUser;
    }
    
    // Create new user with subscription
    return await client.user.create({
      data: {
        clerkId,
        firstname,
        lastname,
        email,
        subscription: {
          create: {},
        },
      },
      select: {
        firstname: true,
        lastname: true,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Re-throw to be handled by the caller
  }
};

export const updateSubscription = async (
  clerkId: string,
  props: { customerId?: string; plan?: "PRO" | "FREE" }
) => {
  try {
    return await client.user.update({
      where: {
        clerkId,
      },
      data: {
        subscription: {
          update: {
            data: {
              ...props,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return null;
  }
};
