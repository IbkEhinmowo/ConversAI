/** @format */

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Mic,
  FileText,
  PenTool,
  BookOpen,
  Users,
  Download,
} from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ConversAI</h1>
      </header>

      <main className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to ConversAI</h2>
          <p className="text-xl mb-8">
            Your AI-powered assistant for various tasks
          </p>
          <button className="px-4 py-2 text-lg font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center mx-auto mb-4 ">
            <Download className="mr-2 h-5 w-5" /> Install ConversAI Extension
          </button>
          <p className="text-sm text-muted-foreground">
            ConversAI is a powerful browser extension that uses speech-to-text
            and local language models.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard icon={<Users />} title="Interview Prep" />
          <FeatureCard icon={<FileText />} title="Meeting Summary" />
          <FeatureCard icon={<Mic />} title="Accessibility" />
          <FeatureCard icon={<BookOpen />} title="Training" />
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-semibold mb-4">Getting Started</h3>
          <p className="mb-4">
            Install the ConversAI extension and start boosting your productivity
            today!
          </p>
          <button className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Learn More
          </button>
        </section>
      </main>

      <footer className="container mx-auto py-6 text-center text-sm text-muted-foreground">
        <p>© 2024 ConversAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col items-center">
        <div className="rounded-full bg-primary/10 p-3 mb-2">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center">
          Enhance your {title.toLowerCase()} with AI-powered assistance.
        </p>
      </div>
    </div>
  );
}
