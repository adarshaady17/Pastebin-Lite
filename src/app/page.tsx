"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved URL from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("lastPasteUrl");
    if (savedUrl) {
      setUrl(savedUrl);
    }
  }, []);

  async function createPaste() {
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const body: any = { content };
      if (ttlSeconds) {
        const ttl = parseInt(ttlSeconds, 10);
        if (ttl >= 1) {
          body.ttl_seconds = ttl;
        }
      }
      if (maxViews) {
        const views = parseInt(maxViews, 10);
        if (views >= 1) {
          body.max_views = views;
        }
      }

      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
        return;
      }

      setUrl(data.url);
      // Save URL to localStorage so it persists across page navigations
      localStorage.setItem("lastPasteUrl", data.url);
      setContent("");
      setTtlSeconds("");
      setMaxViews("");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "30px", color: "#000000", fontSize: "32px" }}>
        Pastebin Lite
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="content"
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "500",
            color: "#000000",
          }}
        >
          Paste Content *
        </label>
        <textarea
          id="content"
          rows={15}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #333333",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "14px",
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here..."
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label
            htmlFor="ttl"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#000000",
            }}
          >
            TTL (seconds, optional)
          </label>
          <input
            id="ttl"
            type="number"
            min="1"
            style={{
              width: "100%",
              padding: "8px",
              border: "2px solid #333333",
              borderRadius: "4px",
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            value={ttlSeconds}
            onChange={(e) => setTtlSeconds(e.target.value)}
            placeholder="e.g., 3600"
          />
        </div>

        <div>
          <label
            htmlFor="maxViews"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#000000",
            }}
          >
            Max Views (optional)
          </label>
          <input
            id="maxViews"
            type="number"
            min="1"
            style={{
              width: "100%",
              padding: "8px",
              border: "2px solid #333333",
              borderRadius: "4px",
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fee",
            border: "2px solid #fcc",
            borderRadius: "4px",
            color: "#c33",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={createPaste}
        disabled={loading || !content.trim()}
        style={{
          padding: "12px 24px",
          backgroundColor: loading ? "#999999" : "#0070f3",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {url && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#e6f3ff",
            border: "2px solid #0070f3",
            borderRadius: "4px",
          }}
        >
          <p
            style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "#000000",
              fontSize: "16px",
            }}
          >
            Paste created successfully!
          </p>
          <p style={{ marginBottom: "8px", color: "#000000" }}>
            Share URL:{" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0066cc",
                wordBreak: "break-all",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              {url}
            </a>
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              alert("URL copied to clipboard!");
            }}
            style={{
              marginTop: "8px",
              padding: "8px 16px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Copy URL
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("lastPasteUrl");
              setUrl("");
            }}
            style={{
              marginTop: "8px",
              marginLeft: "8px",
              padding: "8px 16px",
              backgroundColor: "#999999",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Clear
          </button>
        </div>
      )}
    </main>
  );
}

