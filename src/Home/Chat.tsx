/** @format */

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  Send,
  Users,
  FileText,
  PenTool,
  BookOpen,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import Select from "./Select";

export default function ConversAI() {
  // Define the preprompt
  const preprompt = `
    You are the participant in a meeting or interview. Respond clearly, confidently, and concisely, focusing on your skills, problem-solving, and relevant experience.
     Explain your answers or decisions or ideas very briefly, and provide relevant insights when necessary. If a question or discussion point is unclear, ask for clarification before responding.
      Keep responses professional and to the point, fostering a productive and focused conversation 
    You are here to help with interview / Meeting preparation and realtime support, meeting summaries.
  `;

  const initialMessages = [

  ];

  const [activeTab, setActiveTab] = useState("interview");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef(null);
  const [response, setResponse] = useState("");
  const [model, setModel] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleModelChange = (value) => {
    setModel(value);
    const userMessage = {
      role: "ai",
      content: `new Selected llm model: ${value}`,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
  };

  const handleClick = async () => {
    setLoading(true);
    setInputValue("");
    setResponse("");
    console.log("model", model);

    if (model === "") {
      const userMessage = {
        role: "ai",
        content: "Please select a model",
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setLoading(false);
      return;
    }

    const modelMessage = { role: "user", content: inputValue };
    const newMessages = [...messages, modelMessage];
    setMessages(newMessages);

    const aiMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, aiMessage]);
    const aiMessageIndex = newMessages.length;

    // Include the preprompt in the request payload
    const requestPayload = {
      model: model,
      messages: [
        { role: "system", content: preprompt },
        ...newMessages,
        aiMessage,
      ],
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleNewChat = () => {
    // Placeholder function for creating a new chat
    setMessages([...initialMessages]); // Reset to initial messages without preprompt
    setInputValue("");
    setResponse("");
    console.log("Creating a new chat");
  };

  return (
    <div className="relative max-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`absolute inset-y-0 left-0 z-50 w-64 bg-secondary transform rounded-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out  lg:absolute lg:inset-0`}
      >
        <div className="h-full px-4 py-6 overflow-y-auto rounded-xl ">
          <div className="flex justify-between items-center mb-6 ">
            <h2 className="text-xl font-semibold">Previous Chats</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                console.log(sidebarOpen);
              }}
              className=""
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <Button
            className="w-full mb-4"
            onClick={handleNewChat}
            aria-label="Start a new chat"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          {/* Add your previous chats list here */}
          <p className="text-muted-foreground">No previous chats yet.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        <header className="bg-background p-4 flex justify-between items-center ">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            className=""
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <div className="w-8" /> {/* Spacer */}
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Select onSelect={handleModelChange} />
            </div>
          </CardHeader>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Card className="h-full flex flex-col rounded-none border-x-0 border-b-0">
            <CardContent className="flex-grow flex flex-col">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-4"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="interview">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="sr-only">Interview Prep</span>
                    <span className="hidden sm:inline">Interview Prep</span>
                  </TabsTrigger>
                  <TabsTrigger value="meeting">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="sr-only">Meeting Summary</span>
                    <span className="hidden sm:inline">Meeting Summary</span>
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <PenTool className="w-4 h-4 mr-2" />
                    <span className="sr-only">Content Creation</span>
                    <span className="hidden sm:inline">Content Creation</span>
                  </TabsTrigger>
                  <TabsTrigger value="training">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="sr-only">Training</span>
                    <span className="hidden sm:inline">Training</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <ScrollArea
                ref={scrollAreaRef}
                className="flex-grow p-4 overflow-y-auto border rounded-sm h-[calc(100vh-16rem)] scroll-smooth"
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
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      } max-w-full`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.role === "user" ? "You" : "AI"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`mx-2 p-3 rounded-xl max-w-3xl  ${
                          message.role === "user"
                            ? "bg-black text-white"
                            : "bg-trasparent black"
                        }`}
                      >
                        <ReactMarkdown
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
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
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center space-x-2">
                <Button size="icon" variant="secondary">
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Voice input</span>
                </Button>
                <Input
                  placeholder="Type your message here..."
                  onChange={handleInputChange}
                  value={inputValue}
                  className="rounded-2xl p-6"
                />
                <Button size="icon" onClick={handleClick} disabled={loading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
