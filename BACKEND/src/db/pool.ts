import {Pool} from 'pg'

let pool : Pool | null = null;

export function getPool() : Pool{
    if(!pool){
        const connectionString = process.env.DATABASE_URL

        if(!connectionString){
            throw new Error("DATABASE_URL is not set here")
        }
        // create new pool if not pool exists
        pool = new Pool({ connectionString });
    }
    return pool;
}