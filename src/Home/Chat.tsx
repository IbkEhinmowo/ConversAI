/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  Send,
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

  /////////////////////////////////////////
  /////////////////  API   //////////////////////
  /////////////////////////////////////////
  const [loading, setLoading] = useState(false);

  const generateResponse = async (
    prompt: string,
    onUpdate: (text: string) => void
  ) => {
    setLoading(true);
    let fullResponse = "";

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3.5",
          prompt: prompt,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No readable stream");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const jsonLines = chunk.split("\n").filter(Boolean);

        for (const line of jsonLines) {
          const data = JSON.parse(line);
          fullResponse += data.response;
          onUpdate(fullResponse);

          if (data.done) {
            setLoading(false);
            return fullResponse;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
    setLoading(false);
    return fullResponse;
  };
  //////////////////////////////
  //////////////////////////////
  //////////////////////////////

  // Placeholder messages to display in the chat bubbles
  const initialMessages: Message[] = [
    { role: "user", content: "Hello, how can I help you?" },
    { role: "ai", content: "I'm looking for information on your services." },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Initialize the input state
  const [inputValue, setInputValue] = useState("");

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTheme("dark");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("userData", JSON.stringify(messages));
  }, [messages]);

  // Update handleClick
  const handleClick = async () => {
    if (!inputValue) return;

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const aiMessage: Message = { role: "ai", content: "" };
    setMessages((prev) => [...prev, aiMessage]);
    const aiIndex = messages.length + 1;

    await generateResponse(inputValue, (partial) => {
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === aiIndex ? { ...msg, content: partial } : msg
        )
      );
    });
  };

  // Update handleKey similarly
  const handleKey = async (event: React.KeyboardEvent) => {
    if (!inputValue || event.key !== "Enter") return;

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const aiMessage: Message = { role: "ai", content: "" };
    setMessages((prev) => [...prev, aiMessage]);
    const aiIndex = messages.length + 1;

    await generateResponse(inputValue, (partial) => {
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === aiIndex ? { ...msg, content: partial } : msg
        )
      );
    });
  };

  // Retrieve messages from localStorage on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem("userData");
    if (storedMessages) {
      const parsedMessages: Message[] = JSON.parse(storedMessages);
      setMessages(parsedMessages);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2">
      <Card className="max-w-6xl h-[100vh] flex flex-col w-[90vw]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ConversAI</CardTitle>
            <CardDescription>
              Your AI-powered assistant for various tasks
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-4"
          >
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
          <ScrollArea className="flex-grow pr-4 overflow-y-auto border border-black-500 p-3 rounded-sm max-h-[700px]">
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
                  } max-w-full`}
                >
                  <Avatar className="w-12 h-8">
                    <AvatarFallback>
                      {message.role === "user" ? "You" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg max-w-xl  ${
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
            <Button size="icon" variant="secondary">
              <Mic className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message here..."
              onChange={handleInputChange}
              value={inputValue}
              onKeyDown={handleKey}
            />
            <Button size="icon" onClick={handleClick} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}