import { apiFetch } from "./api";

interface ConnectionInfo {
    // Add appropriate properties here
}

function getRefreshToken(): string | null {
    // Implement your refresh token retrieval logic
    return null;
}

export async function fetchCalendarConnection(token : string){
    const data = await apiFetch<{connection:ConnectionInfo}>(
        "/api/connections",
        {token}
    )
    return data.connection;
}

export async function ConnectionCalendar(token : string){
    const refreshToken = getRefreshToken()
    if(!refreshToken) throw new Error("refreshToken invaild")

    const result = await apiFetch<{url:string}>("/api/connection", {
        method : 'POST',
        token,
        body :{
            redirectUrl : `${window.location.origin}/dashboard`,
            refreshToken 
        }
    });
    window.location.href = result.url;
}


export async function refreshCalendarConnection(token: string){
    await apiFetch("/api/connections/refresh-status"{
        method : 'POST',
        token,

    });
}
    

