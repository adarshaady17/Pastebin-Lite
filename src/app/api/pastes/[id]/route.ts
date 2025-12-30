import { prisma } from "@/lib/db";
import { getNow } from "@/lib/time";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = await getNow();

  // Check if expired
  if (paste.expiresAt && now > paste.expiresAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Check if view limit exceeded (before incrementing)
  // If maxViews = 8: allows views 1-8, blocks view 9+
  // viewCount starts at 0, so:
  // - viewCount 0-7: allowed (will increment to 1-8)
  // - viewCount 8+: blocked (already reached limit)
  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Increment view count (this counts as a view)
  // Only increment if we haven't exceeded the limit
  const updated = await prisma.paste.update({
    where: { id: paste.id },
    data: { viewCount: { increment: 1 } },
  });

  // Calculate remaining views after increment
  const remaining_views =
    updated.maxViews === null
      ? null
      : Math.max(0, updated.maxViews - updated.viewCount);

  return NextResponse.json({
    content: paste.content,
    remaining_views,
    expires_at: paste.expiresAt?.toISOString() || null,
  });
}
