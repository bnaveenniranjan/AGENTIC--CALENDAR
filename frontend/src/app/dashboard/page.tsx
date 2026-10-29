'use client'

import ChatPanel from "@/components/dashboard/chat-panel";
import { Button } from "@/components/ui/button";
import { useDescope, useUser, useSession } from "@descope/nextjs-sdk/client";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import ConnectionsPanel from "@/components/dashboard/connection-panel";
import { LogOut } from "lucide-react";

const styles = {
  loadingShell:
    "app-shell-bg flex h-svh items-center justify-center text-sm text-muted-foreground",
  shell: "app-shell-bg",
  userLabel: "mb-2 truncate px-1 text-sm text-muted-foreground",
  logoutBtn:
    "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
  logoutIcon: "size-4",
} as const;

function DashBoardPage(){
    const sdk = useDescope();
    const router = useRouter();
    const {isAuthenticated, isSessionLoading, sessionToken} = useSession();
    const {user,isUserLoading} = useUser();
    const [loggingOut, setLoggingout] = useState(false);
    const refreshToken = sdk.getRefreshToken?.() ?? undefined;

    const connectionsNode = useMemo(
      () => <ConnectionsPanel sessionToken={sessionToken} refreshToken={refreshToken} />,
      [sessionToken, refreshToken]
    );

    const footerNode = useMemo(
      () => (
        <>
          <div className={styles.userLabel}>
            {isUserLoading ? "Loading..." : user?.name || user?.loginIds?.[0]}
          </div>
          <Button
            variant="ghost"
            className={styles.logoutBtn}
            disabled={loggingOut}
            onClick={handleLogout}
          >
            <LogOut className={styles.logoutIcon} />
            {loggingOut ? "Logging out..." : "log out"}
          </Button>
        </>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isUserLoading, user, loggingOut]
    );

    async function handleLogout() {
      if (loggingOut) return;
      setLoggingout(true);

      try {
        await sdk.logout();
        router.replace("/sign-in");
        router.refresh();
      } catch {
        setLoggingout(false);
      }
    }

    if (isSessionLoading) {
      return <div className={styles.loadingShell}>Checking session ...</div>;
    }

    if (!isAuthenticated || !sessionToken) {
      return null;
    }

    return (
        <div className={styles.shell}>
         <ChatPanel
         sessionToken={sessionToken}
         connections={connectionsNode}
         footer={footerNode}
         />
        </div>
    );
}

export default DashBoardPage;