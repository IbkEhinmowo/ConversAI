/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ConversAI() {
  const [activeTab, setActiveTab] = useState("interview");
  const { theme, setTheme } = useTheme();

  const messagesEndRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  console.log("Component mounted");
  setTheme("dark");
}, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Placeholder messages to display in the chat bubbles
  const messages: Message[] = [
    { role: "user", content: "Hello, how can I help you?" },
    { role: "ai", content: "I'm looking for information on your services." },
  ];
  localStorage.setItem("userData", JSON.stringify(messages));
  const storedMessages = localStorage.getItem("userData");

  if (storedMessages) {
    const messages2: Message[] = JSON.parse(storedMessages); // Deserialize the JSON string back into an array of Message objects
    console.log(messages2, "messages2");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 ">
      <Card className="max-w-6xl h-[100vh] flex flex-col w-[90vw]">
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
                    message.role === "user"
                      ? "flex-row-reverse"
                      : "flex-row"
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
            <Input
              placeholder="Type your message here..."
              
            />
            <Button size="icon" >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}