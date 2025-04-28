import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const routeMatcher = createRouteMatcher(["/", "/auth(.*)", "/portal(.*)", "/images(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!routeMatcher(req)) await auth.protect();
});

export const config = {
//   matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  matcher: [
    // - /chatbot (IGNORED — middleware won't run for /chatbot)
    "/((?!_next|chatbot|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always include API & TRPC routes
    "/(api|trpc)(.*)",
  ],
};
