import { authMiddleware } from "@descope/nextjs-sdk/server";

export default authMiddleware({
    // Routes that do not require authentication
    publicRoutes: ["/sign-in"],
    // Where to redirect unauthenticated users
    redirectUrl: "/sign-in",
});

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - _next/static  (Next.js static files)
         * - _next/image   (Next.js image optimisation)
         * - favicon.ico
         * - api routes (handled separately by the backend)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
