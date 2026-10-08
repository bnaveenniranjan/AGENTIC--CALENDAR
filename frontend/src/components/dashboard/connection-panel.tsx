"use client";

import { useCallback, useState, useEffect } from "react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/Skeleton";
import { Button } from "../ui/button";
import { fetchCalendarConnection, ConnectionInfo } from "@/lib/connections";
import { SessionExpiredError } from "@/lib/api";
import { useRouter } from "next/navigation";

const styles = {
  root: "space-y-1.5",
  title: "px-0.5 text-sm font-semibold text-sidebar-foreground",
  error: "text-xs text-destructive",
  skeleton: "h-11 w-full rounded-xl",
  row: "flex items-center gap-2 rounded-xl bg-sidebar-accent/50 px-2 py-2",
  iconBox: "flex size-8 shrink-0 items-center justify-center rounded-lg",
  iconBoxConnected: "bg-primary text-primary-foreground",
  iconBoxDisconnected: "bg-card text-muted-foreground ring-1 ring-border",
  icon: "size-4",
  meta: "min-w-0 flex-1",
  label: "truncate text-sm font-semibold leading-tight",
  status: "mt-0.5 text-xs font-medium",
  statusConnected: "text-primary",
  statusDisconnected: "text-muted-foreground",
  actionBtn: "h-8 shrink-0 px-2.5",
  refreshBtn: "shrink-0",
  refreshIcon: "size-3.5",
} as const;


function ConnectionsPanel({ sessionToken }: { sessionToken: string }) {

  const router = useRouter();
  const [connection, setConnection] = useState<ConnectionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const handleLoadCalendarConnection = useCallback(async () => {
    setLoading(true);
    try {
      setConnection(await fetchCalendarConnection(sessionToken));
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        router.replace("/sign-in");
        return;
      }
      console.error("failed to load calendar connection:", err);
    } finally {
      setLoading(false);
    }
  }, [sessionToken, router]);

  useEffect(() => {
    handleLoadCalendarConnection();
  }, [handleLoadCalendarConnection]);

  async function handleCalendarConnect() {
    setBusy(true);
    try {
      // connect logic here
    } finally {
      setBusy(false);
    }
  }

  async function handleCalendarRefresh() {
    setBusy(true);
    try {
      await handleLoadCalendarConnection();
    } finally {
      setBusy(false);
    }
  }

  const connected = connection?.status === true;

  return (
    <div className={styles.root}>
      <p className={styles.title}>Connection</p>

      {loading || !connection ? (
        <Skeleton className={styles.skeleton} />
      ) : (
        <div className={styles.row}>
          <div
            className={cn(
              styles.iconBox,
              connected ? styles.iconBoxConnected : styles.iconBoxDisconnected
            )}
          >
            <CalendarDays className={styles.icon} />
          </div>

          <div className={styles.meta}>
            <p className={styles.label}>{connection.label}</p>
            <p className={cn(styles.status, connected ? styles.statusConnected : styles.statusDisconnected)}>
              {connected ? "Connected" : "Disconnected"}
            </p>
          </div>

          <Button
            size="sm"
            variant={connected ? "ghost" : "default"}
            className={styles.actionBtn}
            disabled={busy}
            onClick={handleCalendarConnect}
          >
            {connected ? "Reconnect" : "Connect"}
          </Button>

          <Button
            size="icon-sm"
            variant="ghost"
            className={styles.refreshBtn}
            disabled={busy}
            onClick={handleCalendarRefresh}
          >
            <RefreshCcw className={styles.refreshIcon} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ConnectionsPanel;