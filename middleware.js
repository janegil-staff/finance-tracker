import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  const isAuth = !!token;

  const isPublicPath = ["/", "/login", "/register"].includes(req.nextUrl.pathname);

  if (!isAuth && !isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuth && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
