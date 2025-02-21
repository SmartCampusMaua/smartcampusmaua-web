import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import type { Provider } from "next-auth/providers";
import { NextResponse } from "next/server";

const providers: Provider[] = [
  MicrosoftEntraID({
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
    issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");



const publicRoutes = [
  { path: '/', whenAuthenticated: 'next' },
  { path: '/assets', whenAuthenticated: 'next' },
  { path: '/login', whenAuthenticated: 'redirect' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
//       if (isOnDashboard) {
//         if (isLoggedIn) return true;
//         return false; // Redirect unauthenticated users to login page
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL('/dashboard', nextUrl));
//       }
//       return true;
//     },
//   },

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {

      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname
      const publicRoute = publicRoutes.find(route => route.path === pathname)

      if (!isLoggedIn && publicRoute) {
        return NextResponse.next()
      }

      if (!isLoggedIn && !publicRoute) {
        const redirectUrl = nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
        return NextResponse.redirect(redirectUrl)
      }

      if (isLoggedIn && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
        const redirectUrl = nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
        return NextResponse.redirect(redirectUrl)
      }

      if (isLoggedIn && !publicRoute) {
        return NextResponse.next()
      }

      return true;
    },
  },


  providers,
  pages: {
    signIn: "/login",
  }
});
