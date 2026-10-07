import { string } from 'zod';
import { getPool } from '../db/pool.js';

export type ConnectionStatus = "connected" | " disconnected" | "pending";

export type CurrentConnectionRow ={
    user_id: string;
    provider:"calendar";
    status: ConnectionStatus;
};

export async function getCalendarConnectionRow(userId: string){
}
export async function upsertCalendarConnection(input:{
    userId: string;
    status : ConnectionStatus

}) {
   const result = await getPool().query<CurrentConnectionRow>(
        `
        INSERT INTO connection (user_id,provider,status)
        VALUES ($1, 'calender',$2)
        on CONFLICT (user_id, provider)
        DO UPDATE SET status = EXCLUDED.status
        RETURNING user_id,provider,status
        `,
        [input.userId,input.status],
    );

    return result.rows[0] ?? null;
}
    