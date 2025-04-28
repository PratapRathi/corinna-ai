"use server";
import { client } from "@/lib/prisma";
// import { RedirectToSignIn } from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";

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

// export const onLoginUser = async () => {
//     const user = await currentUser()
//     if (!user) RedirectToSignIn();
//     else {
//       try {
//         const authenticated = await client.user.findUnique({
//           where: {
//             clerkId: user.id,
//           },
//           select: {
//             fullname: true,
//             id: true,
//             type: true,
//           },
//         })
//         if (authenticated) {
//           const domains = await onGetAllAccountDomains()
//           return { status: 200, user: authenticated, domain: domains?.domains }
//         }
//       } catch (error) {
//         return { status: 400 }
//       }
//     }
//   }