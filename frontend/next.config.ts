import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Bound output-file tracing to the repo root so Next.js never walks
  // above C:\Users\b niranjan\Desktop\AGENTIC -CALENDAR (the git root).
  outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;
