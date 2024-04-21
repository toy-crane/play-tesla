import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // x-pathname 헤더를 추가하여 요청 URL을 기록
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-query-params", request.nextUrl.search);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  return response;
}
