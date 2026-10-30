'use client'
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, LoaderCircle, MessageSquarePlus, Sparkle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { listThreads, loadThread, streamAgentChat, ThreadSummary } from "@/lib/agent";
import { SessionExpiredError } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { MarkdownMessage } from "./markdown-message";

const styles = {
  root: "flex h-svh overflow-hidden",
  overlay: "fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] md:hidden",
  aside:
    "fixed inset-y-0 left-0 z-40 flex w-[18.5rem] flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-transform md:static md:translate-x-0",
  asideOpen: "translate-x-0",
  asideClosed: "-translate-x-full",
  brandRow: "flex items-center justify-between gap-2 px-4 pt-4 pb-3",
  brandLeft: "flex min-w-0 items-center gap-2.5",
  brandIcon:
    "flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground",
  brandIconSvg: "size-4",
  brandText: "min-w-0",
  brandTitle: "font-heading text-lg font-semibold tracking-tight",
  brandSubtitle: "truncate text-xs text-muted-foreground",
  mobileCloseBtn: "md:hidden",
  topActions: "space-y-3 px-3 pb-3",
  newChatBtn:
    "w-full justify-start gap-2 rounded-xl border-sidebar-border bg-card/70 text-sm",
  newChatIcon: "size-4",
  separator: "opacity-70",
  chatsSection: "flex min-h-0 flex-1 flex-col px-2 pt-3",
  chatsTitle: "mb-2 px-2 text-sm font-semibold text-sidebar-foreground",
  chatsScroll: "min-h-0 flex-1 px-1 pb-3",
  chatsEmpty: "px-2 py-3 text-sm leading-relaxed text-muted-foreground",
  threadList: "space-y-1",
  threadBtn:
    "w-full rounded-xl px-3 py-2.5 text-left transition-colors disabled:opacity-50",
  threadBtnActive: "bg-sidebar-accent text-sidebar-accent-foreground",
  threadBtnIdle: "hover:bg-sidebar-accent/60",
  threadTitle: "line-clamp-2 text-sm font-medium leading-snug",
  threadTime: "mt-1 block text-xs text-muted-foreground",
  footer: "mt-auto border-t border-sidebar-border p-3",
  main: "relative flex min-w-0 flex-1 flex-col",
  header:
    "flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-background/50 px-3 backdrop-blur-md md:px-5",
  mobileMenuBtn: "md:hidden",
  menuIcon: "size-5",
  headerText: "min-w-0",
  headerTitle: "truncate text-base font-semibold",
  headerSubtitle: "truncate text-sm text-muted-foreground",
  chatColumn: "relative flex min-h-0 flex-1 flex-col",
  messagesScroll: "h-full min-h-0 flex-1",
  messagesInner: "mx-auto w-full max-w-3xl px-4 py-8 sm:px-6",
  emptyState:
    "flex min-h-[52vh] flex-col items-center justify-center text-center",
  emptyIcon:
    "mb-5 flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground",
  emptyIconSvg: "size-6",
  emptyTitle: "font-heading text-3xl font-semibold tracking-tight sm:text-4xl",
  emptyCopy: "mt-3 max-w-md text-base leading-relaxed text-muted-foreground",
  suggestions: "mt-8 flex flex-wrap justify-center gap-2",
  suggestionBtn: "rounded-full border-border/80 bg-card/80 px-3.5 text-[13px]",
  messageList: "space-y-6",
  statusRow: "flex items-center gap-2 text-sm text-muted-foreground",
  statusIcon: "size-4 animate-spin",
  statusIconSm: "size-3.5 animate-spin",
  messageRow: "message-enter flex w-full min-w-0",
  messageRowUser: "justify-end",
  messageRowAssistant: "justify-start",
  bubble:
    "min-w-0 max-w-[min(100%,42rem)] overflow-hidden break-words [overflow-wrap:anywhere]",
  bubbleUser:
    "rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground",
  bubbleAssistant:
    "rounded-2xl rounded-bl-md bg-card px-4 py-3 text-foreground ring-1 ring-primary/15",
  bubbleSystem: "rounded-2xl bg-muted px-4 py-2.5 text-muted-foreground",
  thinking: "inline-flex items-center gap-2 text-sm text-muted-foreground",
  userText: "whitespace-pre-wrap text-[15px] leading-7",
  composerWrap:
    "shrink-0 border-t border-border/60 bg-background/70 px-4 py-4 backdrop-blur-md sm:px-6",
  composerForm:
    "composer-glow mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-border/80 bg-card p-2.5",
  composerInput:
    "max-h-40 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-[15px] shadow-none focus-visible:ring-0",
  sendBtn: "mb-0.5 size-10 shrink-0 rounded-xl",
  sendIcon: "size-4",
  sendIconSpin: "size-4 animate-spin",
  composerHint:
    "mx-auto mt-2.5 max-w-3xl text-center text-[11px] text-muted-foreground",
} as const;

type Props = {
  sessionToken: string;
  connections: ReactNode;
  footer: ReactNode;
};



type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const WELCOME =
  "Connect Google Calendar, then ask about today's agenda, create a Meet, or reschedule something.";

const SUGGESTIONS = [
  "What's on today?",
  "What's on tomorrow?",
  "Find a free slot tomorrow morning",
  "Create a meeting on 20th aug and keep the time as 10am for 30 minutes and keep naveenniranjan30@gmail.com as attendee",
];

function WelcomeMessage(): Message {
  return {
    id: "welcome",
    role: "assistant",
    content: WELCOME,
  };
}


function ChatPanel({ sessionToken, connections, footer }: Props) {

  const router = useRouter();
  const [threadId, setThreadId] = useState(() => crypto.randomUUID())
  const [messages, setMessages] = useState<Message[]>([WelcomeMessage()])
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [prompt, setPrompt] = useState("")
  const [running, setRunning] = useState(false)
  const [loadingThread, setLoadingThread] = useState(false);
  const [progress, setProgress] = useState<string | null>(null)


  // show empty state only when genuinely no conversation and not loading a thread
  const showEmpty =
    messages.length === 1 && messages[0]?.id === 'welcome' && !running && !loadingThread

  const refreshThreads = useCallback(async () => {
    try {
      const data = await listThreads(sessionToken);
      setThreads(data.threads);
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        router.replace("/sign-in");
        return;
      }
      console.error("Failed to list threads:", err);
    }
  }, [sessionToken, router]);

  useEffect(() => {
    refreshThreads();
  }, [refreshThreads]);


  function startNewChat() {
    if (running) return;
    setThreadId(crypto.randomUUID());
    setMessages([WelcomeMessage()]);
    setPrompt("");
  }

  async function resumeThread(nextthreadsId: string) {
    if (running || loadingThread) return;
    setLoadingThread(true);
    setProgress(null);

    try {
      const data = await loadThread(sessionToken, nextthreadsId);
      setThreadId(data.threadId);
      setMessages(data.messages.length > 0 ? data.messages : [WelcomeMessage()]);
      setPrompt("");
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "system",
          content: "Could not load the chat",
        },
      ]);
    } finally {
      setLoadingThread(false);
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim()

    if (!trimmed || running || loadingThread) return;
    const assistantId = crypto.randomUUID();

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(), role: 'user', content: trimmed
      },
      {
        id: assistantId, role: 'assistant', content: ''
      }
    ])

    setPrompt("")
    setRunning(true)
    setProgress(null)


    try {
      await streamAgentChat(
        sessionToken,
        {
          message: trimmed, threadId
        },
        (event) => {
          if (event.type === "token" && event.token) {
            setProgress(null)
            setMessages((current) =>
              current.map((msg) =>
                msg.id === assistantId ?
                  {
                    ...msg,
                    content: msg.content + event.token,
                  }
                  : msg
              ),
            );

          }

          if (event.type === 'error') {
            setProgress(null)
            setMessages((current) =>
              current.map((msg) =>
                msg.id === assistantId ?
                  {
                    ...msg,
                    content: msg.content + ' [Error occurred]',
                  }
                  : msg
              )
            )
          }
        },
      );

      refreshThreads();
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "system",
          content: "Could not reach the agent API",
        },
      ]);
    } finally {
      setRunning(false)
      setProgress(null)
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    sendMessage(prompt);
  }

  function onkeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(prompt);
    }
  }

  return (
    <div className={styles.root}>
      <aside className={styles.aside}>
        <div className={styles.brandRow}>
          <div className={styles.brandLeft}>
            <div className={styles.brandIcon}>
              <Sparkle className={styles.brandIconSvg} />
            </div>

            <div className={styles.brandText}>
              <p className={styles.brandTitle}>Meet Agent</p>
            </div>
          </div>
        </div>
        <div className={styles.topActions}>
          <Button
            variant='outline'
            className={styles.newChatBtn}
            onClick={startNewChat}
          >
            <MessageSquarePlus className={styles.newChatIcon} />
            New Chat
          </Button>
          {connections}
          <Separator className={styles.separator} />
          <div className={styles.chatsSection}>
            <p className={styles.chatsTitle}>chats</p>

            <ScrollArea className={styles.chatsScroll}>
              {
                threads.length === 0 ?
                  <p className={styles.chatsEmpty}>
                    No chats yet. Start one and it will show up here
                  </p> :
                  <div className={styles.threadList}>
                    {
                      threads.map((thread) => {
                        const active = thread.id === threadId;
                        const dateLabel = (() => {
                          try {
                            return new Intl.DateTimeFormat(undefined, {
                              month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            }).format(new Date(thread.updatedAt));
                          } catch { return thread.updatedAt; }
                        })();
                        return (
                          <button
                            key={thread.id}
                            type="button"
                            disabled={running || loadingThread}
                            onClick={() => { resumeThread(thread.id); }}
                            className={cn(
                              styles.threadBtn,
                              active ? styles.threadBtnActive : styles.threadBtnIdle
                            )}
                          >
                            <span className={styles.threadTitle}>{thread.title}</span>
                            <span className={styles.threadTime}>{dateLabel}</span>
                          </button>
                        );
                      })
                    }
                  </div>
              }

            </ScrollArea>


          </div>
        </div>
        <Separator className={styles.separator} />

        <div className={styles.footer}>{footer}</div>
      </aside>
      <section className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <p className={styles.headerTitle}>Assistant</p>
            <p className={styles.headerSubtitle}>Schedule 📒 reschedule your meeting with AI 🤖 </p>
          </div>

        </header>
        <div className={styles.chatColumn}>
          <ScrollArea className={styles.messagesScroll}>
            <div className={styles.messagesInner}>
              {
                loadingThread ? (
                  <div className={styles.statusRow}>
                    <LoaderCircle className={styles.statusIcon} />
                    <span>Loading chat…</span>
                  </div>
                ) : showEmpty ?
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <Sparkles className={styles.emptyIconSvg} />
                    </div>
                    <h2 className={styles.emptyTitle}>Meeting Assistant </h2>
                    <p className={styles.emptyCopy}>{WELCOME}</p>
                    <div className={styles.suggestions}>
                      {
                        SUGGESTIONS.map((currentSuggestionItem) => (
                          <Button
                            key={currentSuggestionItem}
                            type="button"
                            variant='outline'
                            size="sm"
                            onClick={() => sendMessage(currentSuggestionItem)}
                            className={styles.suggestionBtn}
                            disabled={running}
                          >
                            {currentSuggestionItem}
                          </Button>
                        ))
                      }
                    </div>
                  </div>
                  :
                  <div className={styles.messageList}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          styles.messageRow,
                          msg.role === "user" ? styles.messageRowUser : styles.messageRowAssistant
                        )}
                      >
                        <div
                          className={cn(
                            styles.bubble,
                            msg.role === "user" && styles.bubbleUser,
                            msg.role === "assistant" && styles.bubbleAssistant,
                            msg.role === "system" && styles.bubbleSystem
                          )}
                        >
                          {msg.role === "user" ? (
                            <p className={styles.userText}>{msg.content}</p>
                          ) : msg.content ? (
                            <MarkdownMessage content={msg.content} tone={msg.role === "system" ? "system" : "assistant"} />
                          ) : (
                            <span className={styles.thinking}>
                              <LoaderCircle className={styles.statusIconSm} />
                              Thinking…
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {progress && (
                      <div className={styles.statusRow}>
                        <LoaderCircle className={styles.statusIcon} />
                        <span>{progress}</span>
                      </div>
                    )}
                  </div>
              }
            </div>
          </ScrollArea>

          <div className={styles.composerWrap}>
            <form onSubmit={onSubmit} className={styles.composerForm}>
              <Textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={onkeyDown}
                rows={1}
                disabled={running}
                placeholder="ask about your calendar..."
                className={styles.composerInput}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!prompt.trim() || running}
                className={styles.sendBtn}
                aria-label="Send Text Message"
              >
                {running
                  ? <LoaderCircle className={styles.sendIconSpin} />
                  : <ArrowUp className={styles.sendIcon} />
                }
              </Button>

            </form>

          </div>
        </div>

      </section>
    </div>
  );

}

export default ChatPanel;