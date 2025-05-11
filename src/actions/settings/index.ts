"use server"
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onIntegrateDomain = async (domain: string, icon: string) => {
  const user = await currentUser()
  if (!user) return
  try {
    const subscription = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        _count: {
          select: {
            Domain: true,
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })
    const domainExists = await client.user.findFirst({
      where: {
        clerkId: user.id,
        Domain: {
          some: {
            name: domain,
          },
        },
      },
    })

    if (!domainExists) {
      if (
        (subscription?.subscription?.plan == 'STANDARD' &&
          subscription._count.Domain < 1) ||
        (subscription?.subscription?.plan == 'PLUS' &&
          subscription._count.Domain < 5) ||
        (subscription?.subscription?.plan == 'ULTIMATE' &&
          subscription._count.Domain < 10)
      ) {
        const newDomain = await client.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            Domain: {
              create: {
                name: domain,
                icon,
                chatBot: {
                  create: {
                    welcomeMessage: 'Hey there, have  a question? Text us here',
                  },
                },
              },
            },
          },
        })

        if (newDomain) {
          return { status: 200, message: 'Domain successfully added' }
        }
      }
      return {
        status: 400,
        message:
          "You've reached the maximum number of domains, upgrade your plan",
      }
    }
    return {
      status: 400,
      message: 'Domain already exists',
    }
  } catch (error) {
    console.log(error)
  }
}

export const onGetSubscriptionPlan = async () => {
  try {
    const user = await currentUser();
    if (!user) return;
    const plan = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (plan) {
      return plan.subscription?.plan;
    }
  } catch (error) {
    console.log(error);
  }
};

export const onGetAllAccountDomains = async () => {
  const user = await currentUser();
  if (!user) return;
  try {
    const domains = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        Domain: {
          select: {
            name: true,
            icon: true,
            id: true,
            customer: {
              select: {
                chatRoom: {
                  select: {
                    id: true,
                    live: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return { ...domains };
  } catch (error) {
    console.log(error);
  }
};
