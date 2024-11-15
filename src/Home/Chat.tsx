/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Send, Users, FileText, PenTool, BookOpen } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import Select from "./Select";
import { text } from "node:stream/consumers";

export default function ConversAI() {
  const initialMessages = [
    { role: "user", content: "Hello, how can I help you?" },
    { role: "ai", content: "I'm looking for information on your services." },
    { role: "user", content: "my name is ibukun" },
    { role: "ai", content: "okay " },
  ];

  const [activeTab, setActiveTab] = useState("interview"); // for tab switch
  const [loading, setLoading] = useState(false); //
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef(null);
  const [response, setResponse] = useState("");
  const [model, setModel] = useState("");




  const handleModelChange = (value) => {
    setModel(value);

    const userMessage = { role: "user", content: `new Selected llm model: ${value}` };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
  }

  const handleClick = async () => {
    setLoading(true);
    setInputValue("");
    setResponse("");


    const userMessage = { role: "user", content: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Add empty assistant message
    const aiMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, aiMessage]);
    const aiMessageIndex = newMessages.length; // Index of the assistant message

    const requestPayload = {
      model: model,
      messages: [...newMessages, aiMessage],
    };

    try {
      const res = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line) continue;

          try {
            const jsonResponse = JSON.parse(line);

            if (jsonResponse.message?.content) {
              streamResponse += jsonResponse.message.content;
              setResponse(streamResponse);

              // Update the assistant message in messages
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[aiMessageIndex] = {
                  ...updatedMessages[aiMessageIndex],
                  content: streamResponse,
                };
                return updatedMessages;
              });
            }

            if (jsonResponse.done) {
              break;
            }
          } catch (error) {
            console.error("Error parsing JSON chunk:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect

  //   useEffect(() => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //     localStorage.setItem("userData", JSON.stringify(messages));
  //   }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  //   useEffect(() => {
  //     const storedMessages = localStorage.getItem("userData");
  //     if (storedMessages) {
  //       const parsedMessages = JSON.parse(storedMessages);
  //       setMessages(parsedMessages);
  //     }
  //   }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2">
      <Card className="max-w-6xl h-[100vh] flex flex-col w-[90vw]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ConversAI</CardTitle>
            <CardDescription>
              Your AI-powered assistant for various tasks
            </CardDescription>
            <Select onSelect={handleModelChange} />
          </div>
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
          <ScrollArea
            ref={scrollAreaRef}
            className="flex-grow pr-4 overflow-y-hidden border border-black-500 p-3 rounded-sm h-[5em] scroll-smooth"
          >
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
                    className={`mx-2 p-3 rounded-2xl max-w-3xl w-100 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          return !inline && className ? (
                            <pre className="bg-gray-800 text-white p-2 rounded overflow-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code
                              className="bg-gray-400 text-white p-1 rounded"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div />
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
