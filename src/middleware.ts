import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, base64url } from "jose"

export async function middleware(request: NextRequest) {

const path = request.nextUrl.pathname;
const roleToPath: Record<string, string> = {
  admin: "/admin/dashboard",
  users: "/user/dashboard"
};

const loginPaths = ["/user/login", "/admin/login"];
const isLoginPath = loginPaths.includes(path);
const isPrivate =
  path.startsWith("/user/dashboard") ||
  path.startsWith("/admin/dashboard");

const token = request.cookies.get("jwtToken")?.value || "";
if (isPrivate && !token) {
  if (!path.startsWith("/user/login")) {
    return NextResponse.redirect(new URL("/user/login", request.url));
  }
}

try {
  if (token) {
    const base64Secret = process.env.JWT_SECRET;
    if (!base64Secret) throw new Error("Missing JWT_SECRET");
   
    const secret = base64url.decode(base64Secret);
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const role = (payload.role as string)?.toLowerCase();

    // console.log("Payload -"+JSON.stringify(payload))
    // console.log("Role "+role)
    const basePath = roleToPath[role];

    // const dashboardPath = roleToPath[role] || "/";

    // // Prevent redirect loop by skipping redirect if already on dashboardPath
    // if (isLoginPath) {
    //   if (path !== dashboardPath) {
    //     return NextResponse.redirect(new URL(dashboardPath, request.url));
    //   }
    // }

    // Role-based route protection: redirect if mismatched paths, but exclude target path
    console.log("Path "+path)
    if (isPrivate && !path.startsWith(basePath)) {
          const response = NextResponse.redirect(new URL("/", request.url));
          response.cookies.delete("token"); // clear token
          return response;
        }

    return NextResponse.next();
  }
} catch (error) {
  const res = NextResponse.redirect(new URL("/login", request.url));
  res.cookies.delete("jwtToken");
  return res;
}


  // 3. Default allow
  const res = NextResponse.next();
res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
res.headers.set("Pragma", "no-cache");
res.headers.set("Expires", "0");
res.headers.set("Surrogate-Control", "no-store");
return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/user/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/:path*',
    '/login',
    '/user'
  ],
}