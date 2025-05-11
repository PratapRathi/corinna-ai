"use server";
import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { onGetAllAccountDomains } from "../settings";

export const onCompleteUserRegistration = async (fullname: string, clerkId: string, type: string) => {
  try {
    const registeredUser = await client.user.create({
      data: {
        fullname,
        clerkId,
        type,
        subscription: {
          create: {},
        },
      },
      select: {
        fullname: true,
        id: true,
        type: true,
      },
    });

    if (registeredUser) {
      return { status: 200, user: registeredUser };
    }
  } catch (error) {
    return { status: 400, error };
  }
};

export const onLoginUser = async () => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();
  if (!user) return redirectToSignIn();
  else {
    try {
      const authenticated = await client.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          fullname: true,
          id: true,
          type: true,
        },
      });
      if (authenticated) {
        const domains = await onGetAllAccountDomains();
        return { status: 200, user: authenticated, domain: domains?.Domain };
      }
    } catch (error) {
      return { status: 400, error };
    }
  }
};