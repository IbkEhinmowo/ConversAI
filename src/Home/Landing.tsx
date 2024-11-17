/** @format */

"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Mic,
  FileText,
  Languages,
  Brain,
  Download,
  ChevronRight,
  Terminal,
  Github,
  PlayCircle,
  Check,
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "./Header";

export default function LandingPage() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const features = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Commands & Control",
      description:
        "Control your experience hands-free with natural voice commands",
    },
    {
      icon: <Languages className="h-6 w-6" />,
      title: "Real-time Translations",
      description:
        "Break language barriers with instant translations in 100+ languages",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Meeting Support",
      description:
        "Automated note-taking and action item tracking during meetings",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Assistance",
      description:
        "Advanced LLMs provide context-aware support and suggestions",
    },
  ];

  const installSteps = [
    {
      title: "Install Ollama",
      commands: ["# Download and run the installer", "ollama --version"],
      description:
        "Download the installer from ollama.ai and follow the prompts",
    },
    {
      title: "Download Language Model",
      commands: ["ollama pull llama3.2"],
      description: "Pull the required language model",
    },
    {
      title: "Clone Repository",
      commands: [
        "git clone https://github.com/yourusername/convers-ai.git",
        "cd convers-ai",
        "npm install",
      ],
      description: "Clone the repository and install dependencies",
    },
    {
      title: "Start Server",
      commands: ["npm start"],
      description: "Launch the application",
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Product Manager",
      content:
        "Convers.AI has transformed our international team meetings. The real-time translation feature is a game-changer.",
    },
    {
      name: "Sarah Miller",
      role: "Software Engineer",
      content:
        "The voice commands make it incredibly easy to navigate through documentation while coding.",
    },
    {
      name: "David Kim",
      role: "Team Lead",
      content:
        "Meeting summaries and action items are automatically captured, saving us hours of manual note-taking.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Enhance Your Conversations with Convers.AI
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Voice commands, translations, and seamless meeting support—powered by
          advanced LLMs
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Get Started <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            Watch Demo <PlayCircle className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary transition-colors"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Installation Guide */}
      <section className="container mx-auto px-4 py-20 bg-secondary/30">
        <h2 className="text-3xl font-bold text-center mb-12">
          Quick Installation Guide
        </h2>
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="step1" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {installSteps.map((step, index) => (
                <TabsTrigger key={index} value={`step${index + 1}`}>
                  Step {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {installSteps.map((step, index) => (
              <TabsContent key={index} value={`step${index + 1}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">
                      {step.description}
                    </p>
                    <pre className="bg-secondary/50 p-4 rounded-lg">
                      {step.commands.map((cmd, i) => (
                        <code key={i} className="block text-sm">
                          {cmd}
                        </code>
                      ))}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-primary/5">
              <CardContent className="pt-6">
                <p className="mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 bg-secondary/30">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What are the system requirements?
              </AccordionTrigger>
              <AccordionContent>
                Convers.AI requires a modern web browser and 4GB of RAM minimum.
                For optimal performance, we recommend 8GB of RAM and a
                multi-core processor.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Which languages are supported?
              </AccordionTrigger>
              <AccordionContent>
                We support real-time translation for over 100 languages, with
                particularly strong performance in major business languages
                including English, Spanish, Mandarin, and Japanese.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                Yes, all data is processed locally on your machine using Ollama.
                We never store or transmit your conversations to external
                servers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already enhancing their conversations
          with AI
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Download Now <Download className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            View on GitHub <Github className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">Convers.AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Convers.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
