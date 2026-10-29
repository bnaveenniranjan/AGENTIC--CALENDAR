import {Router} from 'express'
import { requireSession } from '../middleware/requireSession.js';
import { getCalendarConnection, createCalendarConnectUrl, refreshCalendarConnection } from '../service/connection.service.js';
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

connectionRouter.post("/connect", async(req, res) => {
    try {
        const bearerToken = (req.headers.authorization ?? "").replace(/^Bearer\s+/i, "").trim();

        if (!bearerToken) {
            res.status(400).json({ error: "Missing bearer token" });
            return;
        }

        // Prefer an explicit refreshToken from the body (sent by Descope SDK on client);
        // fall back to the bearer/session token only if not provided.
        const refreshToken: string =
            typeof req.body?.refreshToken === 'string' && req.body.refreshToken
                ? req.body.refreshToken
                : bearerToken;

        const redirectUrl =
            typeof req.body?.redirectUrl === 'string'
                ? req.body.redirectUrl
                : `${process.env.APP_URL ?? "http://localhost:3000"}/dashboard`;

        const result = await createCalendarConnectUrl({
            userId: req.auth!.userId,
            refreshToken,
            redirectUrl,
        });

        res.json(result);
    } catch(err) {
        console.error("[connect] Descope outbound.connect failed:", err);
        res.status(500).json({ error: "could not start connection" });
    }
});



connectionRouter.post("/refresh-status",async(req,res)=>{
    try{
        const connection = await refreshCalendarConnection({
            userId : req.auth!.userId,
            authUserId : req.auth!.authUserId

        })
        res.json({connection})
    }catch{
        res.status(500).json({error: "failed to refresh the status"})
    }
})

