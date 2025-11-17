"use client";

import { useState, useRef, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { sendMessage } from "~/server/actions/chat";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ClinicalHistoryChatbotProps {
  healthUserCi: string;
  healthUserName: string;
}

export function ClinicalHistoryChatbot({
  healthUserCi,
  healthUserName,
}: ClinicalHistoryChatbotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local storage key for this specific health user
  const storageKey = `chat-history-${healthUserCi}`;

  const { execute: executeSendMessage, isExecuting: isSending } = useAction(
    sendMessage,
    {
      onSuccess: ({ data }) => {
        if (data) {
          setError(null);
          setMessages((prev) => {
            const withoutOptimistic = prev.slice(0, -1);
            const newMessages = [
              ...withoutOptimistic,
              {
                id: `user-${Date.now()}`,
                role: "user" as const,
                content: prev[prev.length - 1]!.content,
                createdAt: new Date(),
              },
              {
                id: `assistant-${Date.now()}`,
                role: "assistant" as const,
                content: data.answer,
                createdAt: new Date(),
              },
            ];
            // Save to localStorage
            localStorage.setItem(storageKey, JSON.stringify(newMessages));
            return newMessages;
          });
          setInputValue("");
        }
      },
      onError: ({ error }) => {
        setError(
          error.serverError ??
            "Error al enviar el mensaje. Por favor, intenta nuevamente.",
        );
        setMessages((prev) => prev.slice(0, -1));
      },
    },
  );

  // Load messages from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      setError(null);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Message[];
          setMessages(
            parsed.map((msg) => ({
              ...msg,
              createdAt: new Date(msg.createdAt),
            })),
          );
        } catch (e) {
          console.error("Error parsing stored messages:", e);
          localStorage.removeItem(storageKey);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, healthUserCi]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isSending) return;

    const messageContent = inputValue.trim();
    setInputValue("");

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: messageContent,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    // Prepare conversation history (exclude the optimistic message)
    const conversationHistory = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    void executeSendMessage({
      healthUserCi,
      message: messageContent,
      conversationHistory,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    setError(null);
    setMessages([]);
    localStorage.removeItem(storageKey);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <MessageCircle className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0 sm:max-w-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <SheetTitle>Asistente de Historia Clínica</SheetTitle>
                {healthUserName && (
                  <p className="text-muted-foreground text-sm">
                    Consulta sobre la historia clínica de {healthUserName}
                  </p>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleNewConversation}
                title="Nueva conversación"
                disabled={messages.length === 0}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {error && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-sm">
                {error}
              </div>
            )}
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <MessageCircle className="mx-auto mb-4 size-16 opacity-20" />
                  <p className="mb-2 text-lg font-medium">
                    Inicia una conversación
                  </p>
                  <p className="text-sm">
                    Pregunta sobre diagnósticos, tratamientos, medicamentos,
                    etc.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <div className="max-w-none text-sm break-words">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="my-2 ml-4 list-outside list-disc space-y-1 pl-1">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="my-2 ml-4 list-outside list-decimal space-y-1 pl-1">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="leading-relaxed">{children}</li>
                            ),
                            code: ({ className, children, ...props }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code
                                  className={cn(
                                    "rounded px-1 py-0.5 font-mono text-xs",
                                    message.role === "user"
                                      ? "bg-primary-foreground/20"
                                      : "bg-muted-foreground/20",
                                  )}
                                  {...props}
                                >
                                  {children}
                                </code>
                              ) : (
                                <code
                                  className={cn(
                                    "block rounded p-2 font-mono text-xs",
                                    message.role === "user"
                                      ? "bg-primary-foreground/20"
                                      : "bg-muted-foreground/20",
                                  )}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => (
                              <pre className="mb-2 overflow-x-auto last:mb-0">
                                {children}
                              </pre>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic">{children}</em>
                            ),
                            h1: ({ children }) => (
                              <h1 className="mb-2 text-lg font-bold">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="mb-2 text-base font-bold">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mb-1 text-sm font-bold">
                                {children}
                              </h3>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote
                                className={cn(
                                  "mb-2 border-l-2 pl-3 italic last:mb-0",
                                  message.role === "user"
                                    ? "border-primary-foreground/30"
                                    : "border-muted-foreground/30",
                                )}
                              >
                                {children}
                              </blockquote>
                            ),
                            a: ({ children, href }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:no-underline"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      <p
                        className={cn(
                          "mt-1 text-[10px]",
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {message.createdAt.toLocaleTimeString("es-UY", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-muted max-w-[85%] rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="bg-muted-foreground/40 size-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
                          <div className="bg-muted-foreground/40 size-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
                          <div className="bg-muted-foreground/40 size-2 animate-bounce rounded-full"></div>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          Pensando...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                disabled={isSending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isSending}
                size="icon"
              >
                {isSending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
