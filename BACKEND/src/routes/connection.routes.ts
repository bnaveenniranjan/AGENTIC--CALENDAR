import {Router} from 'express'
import { requireSession } from '../middleware/requireSession.js';
import { getCalendarConnection } from '../service/connection.service.js';

export const connectionRouter = Router();

connectionRouter.use(requireSession)

connectionRouter.get("/",async(req,res)=>{
    try{
        const connection = await getCalendarConnection(req.auth!.userId)

        res.json({connection})
    }catch{
        res.status(500).json({error:"could not load connection"})
    }
});

connectionRouter.post("/connect",async(req,res)=>{
    try{
        const refreshToken =
        typeof req.body?.refreshToken === 'string' ?
        req.body.refreshToken:"";

        if(!refreshToken){

            res.status(400).json({error : "Refresh token required"})
        }
        const redirectUrl =
        typeof req.body?.redirectUrl === 'string' ?
        req.body.redirectUrl:
        `${process.env.APP_}`
    }catch{
        res.status(500).json({error:"could not start connection"})
    }
})