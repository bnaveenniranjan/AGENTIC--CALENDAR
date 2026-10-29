import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import {
    listUpcomingMeetings,
    checkFreeBusy,
    createMeeting,
    rescheduleMeeting,
    cancelMeeting,
} from './calendar.service.js';

export function createCalendarTools(authUserId: string) {
    return {
        listUpcomingMeetings: createTool({
            id: 'listUpcomingMeetings',
            description: "List Google Calendar events. Set todayOnly=true for today's agenda only.",
            inputSchema: z.object({
                maxResults: z.number().int().min(1).max(20).optional().describe('Maximum number of events to return'),
                todayOnly: z.boolean().optional().describe('If true only return events for today'),
            }),
            execute: async (input) => {
                return await listUpcomingMeetings({
                    authUserId,
                    ...input,
                });
            },
        }),

        checkFreeBusy: createTool({
            id: 'checkFreeBusy',
            description: 'Check if the user is busy between two ISO datetimes using Google Calendar.',
            inputSchema: z.object({
                startIso: z.string().describe('Start time as ISO-8601 datetime'),
                endIso: z.string().describe('End time as ISO-8601 datetime'),
            }),
            execute: async (input) => {
                return await checkFreeBusy({
                    authUserId,
                    ...input,
                });
            },
        }),

        createMeeting: createTool({
            id: 'createMeeting',
            description: 'Create a new Google Calendar meeting with optional Google Meet conferencing and attendee invites.',
            inputSchema: z.object({
                title: z.string().min(1).describe('Title or summary of the meeting'),
                startIso: z.string().describe('Start time as ISO-8601 datetime'),
                endIso: z.string().describe('End time as ISO-8601 datetime'),
                attendeeEmails: z.array(z.string()).optional().describe('Invite these emails; Google sends calendar invites'),
                description: z.string().optional().describe('Meeting description or agenda'),
                addGoogleMeet: z.boolean().optional().describe('Default true. Set false to skip Google Meet link'),
            }),
            execute: async (input) => {
                return await createMeeting({
                    authUserId,
                    ...input,
                });
            },
        }),

        rescheduleMeeting: createTool({
            id: 'rescheduleMeeting',
            description: 'Reschedule  and move  an existing calendar event to a new start/end time and email invitees.',
            inputSchema: z.object({
                eventId: z.string().min(1).describe('Event ID to reschedule'),
                startIso: z.string().optional().describe('New start time as ISO-8601 datetime'),
                endIso: z.string().optional().describe('New end time as ISO-8601 datetime'),
            }),
            execute: async (input) => {
                rescheduleMeeting({
                    authUserId,
                    ...input,
                });
            },
        }),

        cancelMeeting: createTool({
            id: 'cancelMeeting',
            description: 'Cancel and delete an existing Google Calendar event by id and email attendees about the cancellation.',
            inputSchema: z.object({
                eventId: z.string().min(1),
            }),
            execute: async (input) => {
             cancelMeeting({
                    authUserId,
                    ...input,
                });
            },
        }),
    };
}