import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/create-account": true,
  "/sms": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isPublicUrl = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!isPublicUrl) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (isPublicUrl) {
      return NextResponse.redirect(new URL("/checks", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
