// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   '/', 
//   '/item/(.*)',
//   '/api/menu(.*)',
//   '/api/webhooks(.*)'
// ]);

// const isAdminRoute = createRouteMatcher([
//   '/admin(.*)'
// ]);

// export default clerkMiddleware(async (auth, request) => {
//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set('x-pathname', request.nextUrl.pathname);

//   // Public routes — no auth needed (guests can browse menu items)
//   if (isPublicRoute(request)) {
//     return NextResponse.next({
//       request: { headers: requestHeaders },
//     });
//   }

//   // Admin routes — require login (role check disabled for dev)
//   if (isAdminRoute(request)) {
//     await auth.protect();
//     return NextResponse.next({
//       request: { headers: requestHeaders },
//     });
//   }

//   // All other routes require authentication
//   await auth.protect();
//   return NextResponse.next({
//     request: { headers: requestHeaders },
//   });
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };



import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/item/(.*)',
  '/api/menu(.*)',
  '/api/webhooks(.*)'
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // 1. Public routes
  if (isPublicRoute(request)) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // 2. Admin routes
  if (isAdminRoute(request)) {
    // Ensures they are logged in first (redirects to sign-in if guest)
    await auth.protect();

    // Extract session claims
    const { sessionClaims } = await auth();

    // Cast to Record<string, any> to bypass strict TypeScript errors
    const claims = sessionClaims as Record<string, any>;

    // Safely look for the role wherever your JWT template maps it
    const role = claims?.metadata?.role || claims?.publicMetadata?.role;

    if (role !== 'admin') {
      // Boot unauthorized logged-in users back to the homepage
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // 3. All other routes require authentication
  await auth.protect();
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};