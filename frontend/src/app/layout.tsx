import type { Metadata } from "next";
import { AuthProvider } from "@descope/nextjs-sdk";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meeting Assistant",
  description: "Sign in to connect calendar and start scheduling with your agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID ?? "";

  const cookieOptions = {
    sameSite: "Lax" as const,
    secure: process.env.NODE_ENV !== "development",
  };

  return (
    <AuthProvider
      projectId={projectId}
      sessionTokenViaCookie={cookieOptions}
      refreshTokenViaCookie={cookieOptions}
    >
      <html lang="en" className="h-full">
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </AuthProvider>
  );
}
