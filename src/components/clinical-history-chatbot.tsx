"use client";

import { useState, useRef, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import {
  sendMessage,
  getConversation,
  listConversations,
  deleteConversation,
  createConversation,
} from "~/server/actions/chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  MessageCircle,
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ConversationItem {
  id: string;
  healthUserCi: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: Date;
  }>;
  _count: {
    messages: number;
  };
  createdAt: Date;
  updatedAt: Date;
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
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [showConversationList, setShowConversationList] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { execute: executeSendMessage, isExecuting: isSending } = useAction(
    sendMessage,
    {
      onSuccess: ({ data }) => {
        if (data) {
          setError(null);
          setConversationId(data.conversationId);
          // Replace the optimistic user message with the real one and add assistant message
          setMessages((prev) => {
            // Remove the last message (optimistic user message)
            const withoutOptimistic = prev.slice(0, -1);
            // Add the real user message and assistant message
            return [
              ...withoutOptimistic,
              {
                id: data.userMessage.id,
                role: "user" as const,
                content: data.userMessage.content,
                createdAt: new Date(data.userMessage.createdAt),
              },
              {
                id: data.assistantMessage.id,
                role: "assistant" as const,
                content: data.assistantMessage.content,
                createdAt: new Date(data.assistantMessage.createdAt),
              },
            ];
          });
          setInputValue("");
          // Refresh conversation list
          void executeListConversations({ healthUserCi });
        }
      },
      onError: ({ error }) => {
        setError(
          error.serverError ??
            "Error al enviar el mensaje. Por favor, intenta nuevamente.",
        );
        // Remove the optimistic user message on error
        setMessages((prev) => prev.slice(0, -1));
      },
    },
  );

  const {
    execute: executeGetConversation,
    isExecuting: isLoadingConversation,
  } = useAction(getConversation, {
    onSuccess: ({ data }) => {
      if (data) {
        setError(null);
        setConversationId(data.id);
        setMessages(
          data.messages.map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            createdAt: new Date(msg.createdAt),
          })),
        );
        setShowConversationList(false);
      }
    },
    onError: ({ error }) => {
      setError(
        error.serverError ??
          "Error al cargar la conversación. Por favor, intenta nuevamente.",
      );
    },
  });

  const { execute: executeListConversations, isExecuting: isLoadingList } =
    useAction(listConversations, {
      onSuccess: ({ data }) => {
        if (data) {
          setError(null);
          setConversations(data as ConversationItem[]);
        }
      },
      onError: ({ error }) => {
        setError(
          error.serverError ??
            "Error al cargar las conversaciones. Por favor, intenta nuevamente.",
        );
      },
    });

  const { execute: executeDeleteConversation, isExecuting: isDeleting } =
    useAction(deleteConversation, {
      onSuccess: ({ data }) => {
        if (data?.success) {
          setError(null);
          setDeleteDialogOpen(false);
          setConversationToDelete(null);
          // Refresh conversation list
          void executeListConversations({ healthUserCi });
          // If the deleted conversation was active, clear messages
          if (conversationToDelete && conversationToDelete === conversationId) {
            setMessages([]);
            setConversationId(undefined);
            setShowConversationList(true);
          }
        }
      },
      onError: ({ error }) => {
        setError(
          error.serverError ??
            "Error al eliminar la conversación. Por favor, intenta nuevamente.",
        );
      },
    });

  const { execute: executeCreateConversation, isExecuting: isCreating } =
    useAction(createConversation, {
      onSuccess: ({ data }) => {
        if (data) {
          setError(null);
          setConversationId(data.id);
          setMessages([]);
          setShowConversationList(false);
          void executeListConversations({ healthUserCi });
          // Focus input after creating conversation
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
      },
      onError: ({ error }) => {
        setError(
          error.serverError ??
            "Error al crear la conversación. Por favor, intenta nuevamente.",
        );
      },
    });

  // Load conversations when dialog opens
  useEffect(() => {
    if (open) {
      setError(null);
      void executeListConversations({ healthUserCi });
      if (messages.length === 0 && !conversationId) {
        setShowConversationList(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, healthUserCi]);

  // Clear error when switching views
  useEffect(() => {
    if (showConversationList) {
      setError(null);
    }
  }, [showConversationList]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when dialog opens or when conversation is loaded
  useEffect(() => {
    if (open && !showConversationList && messages.length > 0) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, showConversationList, messages.length]);

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

    void executeSendMessage({
      healthUserCi,
      message: messageContent,
      conversationId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (convId: string) => {
    setError(null);
    void executeGetConversation({
      healthUserCi,
      conversationId: convId,
    });
  };

  const handleNewConversation = () => {
    setError(null);
    void executeCreateConversation({ healthUserCi });
  };

  const handleDeleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(convId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteConversation = () => {
    if (conversationToDelete) {
      void executeDeleteConversation({ conversationId: conversationToDelete });
    }
  };

  const handleBackToList = () => {
    setError(null);
    setShowConversationList(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <MessageCircle className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[80vh] max-w-2xl flex-col p-0">
        <DialogHeader className="border-b p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {showConversationList
                  ? "Conversaciones"
                  : "Asistente de Historia Clínica"}
              </DialogTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {showConversationList
                  ? `Conversaciones con ${healthUserName}`
                  : `Consulta sobre la historia clínica de ${healthUserName}`}
              </p>
            </div>
            <div className="flex gap-2">
              {!showConversationList && conversations.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBackToList}
                  disabled={isLoadingConversation || isSending}
                >
                  Ver todas
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNewConversation}
                disabled={isCreating || isLoadingConversation}
                className="gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Nueva
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {showConversationList ? (
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 mb-4 rounded-lg border p-3 text-sm">
                {error}
              </div>
            )}
            {isLoadingList ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <MessageCircle className="mx-auto mb-2 size-12 opacity-20" />
                  <p>Cargando conversaciones...</p>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <MessageSquare className="mx-auto mb-2 size-12 opacity-20" />
                  <p>No hay conversaciones</p>
                  <p className="text-xs">Crea una nueva para empezar</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => {
                  const lastMessage = conv.messages[0];
                  const preview = lastMessage
                    ? lastMessage.content.substring(0, 60) +
                      (lastMessage.content.length > 60 ? "..." : "")
                    : "Sin mensajes";

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={cn(
                        "hover:bg-muted group flex cursor-pointer items-start justify-between rounded-lg border p-4 transition-all",
                        conv.id === conversationId &&
                          "bg-muted border-primary shadow-sm",
                        isLoadingConversation &&
                          "pointer-events-none opacity-50",
                      )}
                    >
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="size-4 flex-shrink-0" />
                          <p className="text-sm font-medium">
                            {new Date(conv.createdAt).toLocaleDateString(
                              "es-UY",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <p className="text-muted-foreground mt-1 truncate text-sm">
                          {preview}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {conv._count.messages} mensaje
                          {conv._count.messages !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-destructive/10 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        disabled={isDeleting || isLoadingConversation}
                      >
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {error && (
                <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-sm">
                  {error}
                </div>
              )}
              {isLoadingConversation && messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-muted-foreground text-center">
                    <MessageCircle className="mx-auto mb-2 size-12 opacity-20" />
                    <p>Cargando conversación...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-muted-foreground text-center">
                    <MessageCircle className="mx-auto mb-2 size-12 opacity-20" />
                    <p>Inicia una conversación</p>
                    <p className="text-xs">
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
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
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
                      <div className="bg-muted max-w-[80%] rounded-2xl px-4 py-3">
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
                  disabled={isSending || isLoadingConversation}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !inputValue.trim() || isSending || isLoadingConversation
                  }
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
          </>
        )}
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Conversación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta conversación? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setConversationToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteConversation}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
