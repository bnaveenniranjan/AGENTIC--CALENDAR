import { getPool } from '../db/pool.js';

export type ConnectionStatus = "connected" | " disconnected" | "pending";

export type CurrentConnectionRow ={
    user_id: string;
    provider:"calendar";
    status: ConnectionStatus;
};

export async function getCalendarConnectionRow(userId: string){
    const result = await getPool().query<CurrentConnectionRow>(
        `
        SELECT user_id,provider,status
        FROM CONNECTIONS
        WHERE user_id = $1 AND PROVIDER ='calendar'


        `,[userId]
    )
    return result.rows[0] ?? null;
}