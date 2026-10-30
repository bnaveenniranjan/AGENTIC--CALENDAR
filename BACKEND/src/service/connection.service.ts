import { CALENDAR_CONNECTION_ID, CALENDAR_CONNECTION_LABEL, descopeClient } from "../config/descope.js";
import { getCalendarConnectionRow, upsertCalendarConnection } from "../repositories/connection.repository.js";

function calendarAppId(){
    if(!CALENDAR_CONNECTION_ID){
         throw new Error("CALENDAR_CONNECTION_ID is not present in env")
    }

    return CALENDAR_CONNECTION_ID
}

export async function getCalendarConnection(userId: string){
    const row = await getCalendarConnectionRow(userId)
    return{
        id: row?.user_id ?? userId,
        label : CALENDAR_CONNECTION_LABEL,
        status : row?.status === "connected"
    }
}
export async function createCalendarConnectUrl(input :{
    userId : string;
    refreshToken : string;
    redirectUrl:string
}){
    const appId = calendarAppId();
    console.log("[connect] Using appId:", appId);
    console.log("[connect] redirectUrl:", input.redirectUrl);

    const response = await descopeClient.outbound.connect(
        appId,
        {redirectUrl : input.redirectUrl},
        input.refreshToken
    )

    console.log("[connect] Descope response ok:", response.ok);
    console.log("[connect] Descope response data:", JSON.stringify(response.data));
    console.log("[connect] Descope response error:", JSON.stringify((response as any).error));

    if(!response.ok || !response.data?.url){
        throw new Error("could not start connection")
    }

    await upsertCalendarConnection({userId : input.userId,status:'pending' })

    return {url : response.data.url};

}

export async function refreshCalendarConnection(input:{
    userId: string;
    authUserId : string
}){

    if(!process.env.DESCOPE_MANAGEMENT_KEY){
        throw new Error("DESCOPE_MANAGEMENT_KEY is not set in env file ")
    }
    const response = await descopeClient.management.outboundApplication.fetchToken(
        calendarAppId(),
        input.authUserId
    )

    const status = response.ok && response.data ? "connected" : "disconnected"

    const  row = await upsertCalendarConnection ({
        userId : input.userId,
        status,
    });
    return {
        id: row?.user_id ?? input.userId,
        label:CALENDAR_CONNECTION_LABEL,
        status : status === "connected",
    };
}