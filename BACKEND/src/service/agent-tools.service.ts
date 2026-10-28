import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { listUpcomingMeetings, checkFreeBusy, rescheduleMeeting } from './calendar.service.js';
import { id } from 'zod/locales';
import { send } from 'process';

export function createCalendarTools(authUserId: string) {
    return {
        listUpcomingMeeting: createTool({
            id: 'listUpcomingMeetings',
            description: "List Google Calendar events. Set todayOnly=true for today's agenda only.",
            inputSchema: z.object({
                maxResults: z.number().int().min(1).max(20).optional(),
                todayOnly: z.boolean().optional().describe("If true only return events for today"),
            }),
            execute: async ({ maxResults, todayOnly }) => {
                return await listUpcomingMeetings({
                    authUserId,
                    maxResults,
                    todayOnly,
                });
            },
        }),

        checkCalendarcreateMeeting: createTool({
            id: 'createMeeting',
            description: 'Check if the user is busy between two ISO datetimes using Google Calendar',
            inputSchema: z.object({
                startIso: z.string().describe('Start time as ISO-8601 datetime'),
                endIso: z.string().describe('End time as ISO-8601 datetime'),
                attendeeEmails : z.array(z.string()).optional().describe("Invite these emails; Google sends calendar invites"),
                description : z.string().optional(),
                addGoogleMeet : z.boolean().optional().describe("Default true .setfalse to skip google Meet Link")
            }),

            execute: async (input) => {
                createMeeting({
                    authUserId,
                    ...input,
                });
            },
        }),

         rescheduleMeeting : createTool({
            id : "rescheduleMeeting",
            description : "you have an existing event to a new start/end time and email invitess.",
            inputSchema: z.object({
                eventId : z.string().min(1),
                        startIso : z.string(),describe("start time as ISO-8601 datetime"),
                        endIso : z.string().describe("End time as ISO-8601 datetime"),

            }),
            execute : async(input)=>{
                rescheduleMeeting({
                    authUserId,
                    ...input,
                })
            }
            
        }),

        cancelMeeting : createTool({
            id : "cancelMeeting",
            description : :cancel a Google Calendar event by id and send email notifivations
            inputSchema : z.object({
                            eventId : z.string().min(1),
            })  
            execute : async(input)=>{
                cancelMeeting({
                    authUserId,
                    ..input,
                });
            }
        }),
    };
}