export function validatePaste(body: any): string | null {
  if (!body.content || typeof body.content !== "string" || body.content.trim().length === 0) {
    return "content must be a non-empty string";
  }

  if (body.ttl_seconds !== undefined) {
    if (typeof body.ttl_seconds !== "number" || !Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
      return "ttl_seconds must be an integer >= 1";
    }
  }

  if (body.max_views !== undefined) {
    if (typeof body.max_views !== "number" || !Number.isInteger(body.max_views) || body.max_views < 1) {
      return "max_views must be an integer >= 1";
    }
  }

  return null;
}
