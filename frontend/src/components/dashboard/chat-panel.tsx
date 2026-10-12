'use client'
import {ReactNode} from "react";
import { MessageSquarePlus, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connection } from "next/server";
import { Separator } from "@base-ui/react";

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

type Props ={
    sessionToken : string;
    connections : ReactNode;
    footer : ReactNode;
}

function ChatPanel ({sessionToken,connections,footer}:Props){
    return(
        <div className={styles.root}>
            <aside className={styles.aside}>
                <div className={styles.brandRow}>
                    <div className={styles.brandLeft}>
                          <div className={styles.brandIcon}>
                                <Sparkle className={styles.brandIconSvg}/>
                        </div>

                        <div className={styles.brandText}>
                            <p className={styles.brandTitle}>Meet Agent</p>
                        </div>
                    </div>
                </div>
                <div className={styles.topActions}>
                    <Button 
                    variant ='outline'
                    className={styles.newChatBtn}
                    >
                        <MessageSquarePlus className={styles.newChatIcon}/>
                        New Chat
                    </Button>
                    {connections}
                    <div/>
                    <Separator className={styles.separator}/>   
                    <div className={styles.chatsSection}>
                        <p className={styles.chatsTitle}>chats</p>
                    </div>
                </div>
            </aside>
        </div>
    );

}

export default ChatPanel ;