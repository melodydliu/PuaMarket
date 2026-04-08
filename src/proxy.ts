import { type NextRequest, NextResponse } from "next/server";

// Auth guards are disabled until Supabase credentials are wired up.
// See todo.md — "Restore middleware auth guards"
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
