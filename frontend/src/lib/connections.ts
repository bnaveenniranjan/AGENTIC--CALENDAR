import { apiFetch } from "./api";

export interface ConnectionInfo {
    id: string;
    status: boolean;
    label: string;
}




export async function fetchCalendarConnection(token : string){
    const data = await apiFetch<{connection:ConnectionInfo}>(
        "/api/connections",
        {token}
    )
    return data.connection ?? { id: "", status: false, label: "Calendar" };
}

export async function connectionCalendar(token : string){
    const result = await apiFetch<{url:string}>("/api/connection/connect", {
        method : 'POST',
        token,
        body :{
            redirectUrl : `${window.location.origin}/dashboard`,
        }
    });
    window.location.href = result.url;
}


export async function refreshCalendarConnection(token: string){
    await apiFetch("/api/connections/refresh-status", {
        method : 'POST',
        token,

    });
}
    

