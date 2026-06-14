"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type FilledUser = {
  user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
  clerkUserId: string;
  userId: string;
};

type EmptyUser = {
  user: null;
  clerkUserId: null;
  userId: null;
};

export async function getUser(throwError?: true): Promise<FilledUser>;
export async function getUser(throwError: false): Promise<FilledUser | EmptyUser>;
export async function getUser(throwError = true): Promise<FilledUser | EmptyUser> {
  const { userId: clerkUserId } = await auth();

  const emptyUser: EmptyUser = {
    user: null,
    clerkUserId: null,
    userId: null,
  };

  if (!clerkUserId) {
    if (!throwError) return emptyUser;
    throw new Error("Unauthorized");
  }

  let user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

    user = await prisma.user.upsert({
      where: { email },
      update: { clerkUserId },
      create: {
        clerkUserId,
        email,
        name: clerkUser.fullName ?? clerkUser.firstName ?? "",
      },
    });
  }

  return {
    user,
    clerkUserId,
    userId: user.id,
  };
}