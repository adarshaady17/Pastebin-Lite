import { prisma } from "@/lib/db";
import { getNow } from "@/lib/time";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    notFound();
  }

  const now = await getNow();

  // Check if expired
  if (paste.expiresAt && now > paste.expiresAt) {
    notFound();
  }

  // Check if view limit exceeded
  // Note: HTML views don't increment view count, only API fetches do
  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    notFound();
  }

  // Render content safely (React automatically escapes HTML)
  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <pre
        style={{
          padding: "20px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          backgroundColor: "#f8f8f8",
          border: "2px solid #333333",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#000000",
          overflow: "auto",
        }}
      >
        {paste.content}
      </pre>
    </div>
  );
}
