import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
	const jwt = request.cookies.get("ip_token");
	const data = await verifyAccessToken(jwt);
	if (!jwt || new Date(data.time).getTime() <= new Date().getTime()) {
		return NextResponse.redirect(new URL("/captcha", request.url));
	}
}

export const config = {
	matcher: [
		"/((?!api/captcha|_next/static|_next/image|auth|favicon.ico|robots.txt|captcha|images|$).*)",
		"/", //you can disable it if you want to allow home page access
	],
};
