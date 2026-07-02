import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSafeEnvironment(): "development" | "production" | "test" {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    return process.env.NODE_ENV;
  }

  return "production";
}

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "campanha-facil-ia",
      timestamp: new Date().toISOString(),
      environment: getSafeEnvironment(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
