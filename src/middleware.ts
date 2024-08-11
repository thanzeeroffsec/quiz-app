import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function middleware(req: NextRequest) {
  // Get the token from the cookie
  const tokenCookie = req.cookies.get("token");
  const token = tokenCookie?.value;

  if (!token) {
    console.log("No token found, redirecting...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Use `jwtVerify` from `jose` to verify the token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply the middleware to specific routes
export const config = {
  matcher: ["/admin", "/api/admin/:path*"],
};
