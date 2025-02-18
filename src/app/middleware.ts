export { auth as middleware } from "@/app/authjs"
// import { NextRequest, NextResponse } from 'next/server';
// import { NextResponse, NextRequest } from "next/server";
// import { auth } from "./auth";

// export default auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
