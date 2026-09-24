'use client'

import {Button} from "@/components/ui/button";
import { useDescope } from "@descope/nextjs-sdk/client";
import { useRouter } from "next/navigation";          // ← ADD THIS
import { useState } from "react";

function DashBoardPage(){
    const sdk = useDescope()
    const router = useRouter()                         // ← ADD THIS
    const [loggingOut,setLoggingout] = useState(false)

    async function handleLogout(){

        if(loggingOut) return
        setLoggingout(true)

        try{
            await sdk.logout();
            router.replace("/sign-in");
            router.refresh();
        }catch{
            setLoggingout(false)
        }
    }

    return (
        <div>
            DashboardPage
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
}

export default DashBoardPage;