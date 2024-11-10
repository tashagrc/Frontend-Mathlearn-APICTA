import { NextResponse } from "next/server";
import { checkToken } from "./server/api";
import { checkUserIsRecommended } from "./server/recommendation";

export async function middleware(request) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // Check if maintenance mode is enabled
  if (
    isMaintenanceMode &&
    !request.nextUrl.pathname.startsWith("/maintenance")
  ) {
    const url = new URL("/maintenance", request.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  // Define your `checkToken` and `checkUserIsRecommended` functions
  const checkTokenUser = async () => {
    return await checkToken();
  };

  const checkUserIsRecommendedQuiz = async () => {
    return await checkUserIsRecommended();
  };

  // Check if the token is valid
  if (await checkTokenUser()) {
    const response = await checkUserIsRecommendedQuiz();
    if (
      !response.body.response &&
      !request.nextUrl.pathname.startsWith("/user/recommendation")
    ) {
      const url = new URL("/user/recommendation", request.nextUrl.origin);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|maintenance).*)",
};
