import { headers } from "next/headers";

export async function getNow(): Promise<Date> {
  if (process.env.TEST_MODE === "1") {
    const h = await headers();
    const testNow = h.get("x-test-now-ms");
    if (testNow) {
      return new Date(Number(testNow));
    }
  }
  return new Date();
}
