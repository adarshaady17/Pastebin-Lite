import { prisma } from "@/lib/db";
import { getNow } from "@/lib/time";
import { validatePaste } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const error = validatePaste(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const now = await getNow();
    const expiresAt = body.ttl_seconds
      ? new Date(now.getTime() + body.ttl_seconds * 1000)
      : null;

    const paste = await prisma.paste.create({
      data: {
        content: body.content,
        expiresAt,
        maxViews: body.max_views ?? null,
      },
    });

    // Get base URL from request headers or environment variable
    const host = req.headers.get("host");
    const protocol =
      req.headers.get("x-forwarded-proto") ||
      (process.env.NODE_ENV === "development" ? "http" : "https");
    const baseUrl =
      process.env.BASE_URL ||
      (host ? `${protocol}://${host}` : "https://your-app.vercel.app");

    return NextResponse.json({
      id: paste.id,
      url: `${baseUrl}/p/${paste.id}`,
    });
  } catch (error) {
    console.error("Error creating paste:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes("database")) {
      return NextResponse.json(
        { error: "Database connection error. Please check your DATABASE_URL." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
