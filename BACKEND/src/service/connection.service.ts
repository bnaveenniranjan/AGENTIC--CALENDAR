import { CALENDAR_CONNECTION_ID, CALENDAR_CONNECTION_LABEL } from "../config/descope.js";
import { getCalendarConnectionRow } from "../repositories/connection.repository.js";

function calendarAppId(){
    if(!CALENDAR_CONNECTION_ID){
         throw new Error("CALENDAR_CONNECTION_ID is not present in env")
    }

    return CALENDAR_CONNECTION_ID
}

export async function getCalendarConnection(userId: string){
    const row = await getCalendarConnectionRow(userId)
    return{
        label : CALENDAR_CONNECTION_LABEL,
        status : row?.status ?? ("disconnected" as const)
    }
}