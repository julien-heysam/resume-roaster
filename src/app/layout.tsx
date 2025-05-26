import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/session-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Resume Roaster - Brutally Honest Resume Feedback",
  description: "Get AI-powered, brutally honest feedback on your resume. Transform weak resumes into interview magnets with Resume Roaster's intelligent analysis and optimization suggestions.",
  keywords: ["resume", "feedback", "AI", "job search", "career", "optimization", "ATS"],
  authors: [{ name: "Resume Roaster Team" }],
  openGraph: {
    title: "Resume Roaster - Brutally Honest Resume Feedback",
    description: "Transform your resume with AI-powered analysis and get the job you deserve",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
