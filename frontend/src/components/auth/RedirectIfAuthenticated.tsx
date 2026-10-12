'use client'

import { useSession } from "@descope/nextjs-sdk/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Skeleton } from "../ui/Skeleton";

export function RedirectifAuthenticated({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isSessionLoading } = useSession();
    const router = useRouter();
    const redirectedRef = useRef(false);

    useEffect(() => {
        if (redirectedRef.current) return;
        if (!isSessionLoading && isAuthenticated) {
            redirectedRef.current = true;
            router.replace("/dashboard");
        }
    }, [isAuthenticated, isSessionLoading, router]);

    if (isSessionLoading) {
        return (
            <div className="flex flex-col items-center gap-3 py-8">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (isAuthenticated) return null;

    return children;
}
