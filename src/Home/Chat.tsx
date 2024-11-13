/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  StopCircle,
  Send,
  Sun,
  Moon,
  Users,
  FileText,
  PenTool,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock function to simulate speech-to-text
const mockSpeechToText = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("This is a simulated speech-to-text result.");
    }, 2000);
  });
};

// Mock function to simulate LLM processing
const mockLLMProcess = (input: string, task: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`Processed ${task} result for input: ${input}`);
    }, 1500);
  });
};

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ConversAI() {
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("interview");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setTheme("dark");
  }, [setTheme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleListen = async () => {
    setIsListening(true);
    const result = await mockSpeechToText();
    setInput(result);
    setIsListening(false);
  };

  const handleStop = () => {
    setIsListening(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const result = await mockLLMProcess(input, activeTab);
    const aiMessage: Message = { role: "ai", content: result };
    setMessages((prev) => [...prev, aiMessage]);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 ">
      <Card className=" max-w-6xl h-[100vh] flex flex-col w-[90vw]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ConversAI</CardTitle>
            <CardDescription>
              Your AI-powered assistant for various tasks
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="interview">
                <Users className="w-4 h-4 mr-2" />
                Interview Prep
              </TabsTrigger>
              <TabsTrigger value="meeting">
                <FileText className="w-4 h-4 mr-2" />
                Meeting Summary
              </TabsTrigger>
              <TabsTrigger value="content">
                <PenTool className="w-4 h-4 mr-2" />
                Content Creation
              </TabsTrigger>
              <TabsTrigger value="training">
                <BookOpen className="w-4 h-4 mr-2" />
                Training
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ScrollArea className="flex-grow pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex items-start ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Button onClick={handleListen} disabled={isListening} size="icon">
              <Mic className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
