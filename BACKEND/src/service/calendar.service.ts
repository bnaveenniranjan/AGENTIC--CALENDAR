import { google } from 'googleapis';
import { randomUUID } from 'node:crypto';
import { getCalendarAccessToken } from './token.service.js';

/**
 * Initializes and returns an authenticated Google Calendar API v3 client using an access token.
 */
function calendarClient(accessToken: string) {
    const auth = new google.auth.OAuth2();

    auth.setCredentials({
        access_token: accessToken,
    });

    return google.calendar({
        version: 'v3',
        auth,
    });
}

/**
 * Fetches a valid Google Calendar access token for the given user and returns an authorized Calendar client.
 */
async function calendarForUser(authUserId: string) {
    const accessToken = await getCalendarAccessToken(authUserId);

    return calendarClient(accessToken);
}

/**
 * Normalizes raw Google Calendar event objects into a clean, consistent format.
 */
function formatEvent(event: {
    id?: string | null;
    summary?: string | null;
    description?: string | null;
    location?: string | null;
    start?: { dateTime?: string | null; date?: string | null } | null;
    end?: { dateTime?: string | null; date?: string | null } | null;
    htmlLink?: string | null;
    hangoutLink?: string | null;
    attendees?: Array<{
        email?: string | null;
        displayName?: string | null;
    }> | null;
}) {
    return {
        id: event.id,
        title: event.summary ?? "(no title)",
        description: event.description?.trim() || null,
        location: event.location?.trim() || null,
        start: event.start?.dateTime ?? event.start?.date ?? null,
        end: event.end?.dateTime ?? event.end?.date ?? null,
        htmlLink: event.htmlLink ?? null,
        meetLink: event.hangoutLink ?? null,
        attendees: (event.attendees ?? [])
            .map((person) => person.email || person.displayName)
            .filter((value): value is string => Boolean(value)),
    };
}

/**
 * Lists upcoming meetings for the authenticated user, optionally filtered to today only.
 */
export async function listUpcomingMeetings(input: {
    authUserId: string;
    maxResults?: number;
    todayOnly?: boolean;
}) {
    const calendar = await calendarForUser(input.authUserId);

    let timeMin = new Date().toISOString();
    let timeMax: string | undefined;

    // this will limit the number of meetings to show for a particular day
    if (input.todayOnly) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        timeMin = start.toISOString();
        timeMax = end.toISOString();
    }

    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        maxResults: input.maxResults ?? 10,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return (response.data.items ?? []).map(formatEvent);
}

/**
 * Creates a new calendar meeting with optional Google Meet conferencing and attendee invitations.
 */
export async function createMeeting(input: {
    authUserId: string;
    title: string;
    startIso: string;
    endIso: string;
    attendeeEmails?: string[];
    description?: string;
    addGoogleMeet?: boolean;
}) {
    const calendar = await calendarForUser(input.authUserId);
    const withMeet = input.addGoogleMeet !== false;

    const response = await calendar.events.insert({
        calendarId: 'primary',
        sendUpdates: 'all',
        conferenceDataVersion: withMeet ? 1 : undefined,
        requestBody: {
            summary: input.title,
            description: input.description,
            start: {
                dateTime: input.startIso,
            },
            end: {
                dateTime: input.endIso,
            },
            attendees: (input.attendeeEmails ?? []).map((email) => ({ email })),
            conferenceData: withMeet
                ? {
                    createRequest: {
                        requestId: randomUUID(),
                        conferenceSolutionKey: {
                            type: 'hangoutsMeet',
                        },
                    },
                }
                : undefined,
        },
    });

    return {
        ...formatEvent(response.data),
        inviteEmailsSent: (input.attendeeEmails ?? []).length > 0,
        googleMeetAdded: withMeet,
    };
}

/**
 * Cancels/deletes an existing calendar meeting by event ID and notifies all attendees.
 */
export async function cancelMeeting(input: {
    authUserId: string;
    eventId: string;
}) {
    const calendar = await calendarForUser(input.authUserId);

    await calendar.events.delete({
        calendarId: 'primary',
        eventId: input.eventId,
        sendUpdates: 'all',
    });

    return {
        cancelled: true,
        eventId: input.eventId,
    };
}

/**
 * Reschedules an existing calendar event with updated start and/or end times.
 */
export async function rescheduleMeeting(input: {
    authUserId: string;
    eventId: string;
    startIso?: string;
    endIso?: string;
}) {
    const calendar = await calendarForUser(input.authUserId);

    const response = await calendar.events.patch({
        calendarId: 'primary',
        eventId: input.eventId,
        sendUpdates: 'all',
        requestBody: {
            start: input.startIso ? { dateTime: input.startIso } : undefined,
            end: input.endIso ? { dateTime: input.endIso } : undefined,
        },
    });

    return formatEvent(response.data);
}

/**
 * Queries Google Calendar free/busy status to check schedule availability for a time range.
 */
export async function checkFreeBusy(input: {
    authUserId: string;
    startIso: string;
    endIso: string;
}) {
    const calendar = await calendarForUser(input.authUserId);

    const response = await calendar.freebusy.query({
        requestBody: {
            timeMin: input.startIso,
            timeMax: input.endIso,
            items: [{ id: 'primary' }],
        },
    });

    const busy = response.data.calendars?.['primary']?.busy ?? [];
    return {
      busy : busy.map(item=>({
        start : item.start ?? null,
        end : item.end ?? null
      }))
    };
}
