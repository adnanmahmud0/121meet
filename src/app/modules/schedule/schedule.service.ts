import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { google } from 'googleapis';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { ScheduleRepository } from './schedule.repository';
import { IScheduleMeeting } from './schedule.model';

const toDateOrNow = (value?: string) => (value ? new Date(value) : new Date());

const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60000);

const getCalendarClient = async () => {
  if (config.google?.service_account_credentials) {
    const auth = new google.auth.GoogleAuth({
      keyFile: config.google.service_account_credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    return google.calendar({ version: 'v3', auth });
  }

  if (
    config.google?.client_id &&
    config.google?.client_secret &&
    config.google?.refresh_token
  ) {
    const oAuth2Client = new google.auth.OAuth2(
      config.google.client_id,
      config.google.client_secret,
      config.google.redirect_uri
    );
    oAuth2Client.setCredentials({ refresh_token: config.google.refresh_token });
    return google.calendar({ version: 'v3', auth: oAuth2Client });
  }

  throw new ApiError(
    StatusCodes.BAD_REQUEST,
    'Google Calendar is not configured'
  );
};

const createGoogleEvent = async (payload: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
}) => {
  const calendar = await getCalendarClient();
  const requestId = `req-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const event = await calendar.events.insert({
    calendarId: config.google?.calendar_id || 'primary',
    requestBody: {
      summary: payload.title,
      description: payload.description,
      start: { dateTime: payload.startTime.toISOString() },
      end: { dateTime: payload.endTime.toISOString() },
      attendees: payload.attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId,
        },
      },
    },
    conferenceDataVersion: 1,
  });

  const googleEventId = event.data.id as string;
  const meetLink =
    (event.data.hangoutLink as string | undefined) ||
    (event.data.conferenceData?.entryPoints || [])
      .find(ep => ep.entryPointType === 'video')
      ?.uri;

  return { googleEventId, googleMeetLink: meetLink };
};

const createScheduleToDB = async (
  user: JwtPayload,
  payload: {
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    isInstantMeeting: boolean;
    assignedUsers: string[];
  }
) => {
  let start = payload.isInstantMeeting
    ? new Date()
    : toDateOrNow(payload.startTime);
  let end = payload.isInstantMeeting
    ? addMinutes(start, 30)
    : toDateOrNow(payload.endTime);

  if (!start || !end) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Invalid startTime or endTime'
    );
  }

  const { googleEventId, googleMeetLink } = await createGoogleEvent({
    title: payload.title,
    description: payload.description,
    startTime: start,
    endTime: end,
    attendees: payload.assignedUsers || [],
  });

  const doc = await ScheduleRepository.create({
    title: payload.title,
    description: payload.description,
    startTime: start,
    endTime: end,
    isInstantMeeting: payload.isInstantMeeting,
    assignedUsers: payload.assignedUsers || [],
    googleEventId,
    googleMeetLink,
    createdBy: user.id,
  } as Partial<IScheduleMeeting>);

  return {
    meetingId: String(doc._id),
    googleEventId,
    googleMeetLink: googleMeetLink || null,
    startTime: doc.startTime,
    endTime: doc.endTime,
    assignedUsers: doc.assignedUsers,
  };
};

const getSchedulesByEmailFromDB = async (email: string) => {
  const meetings = await ScheduleRepository.find({
    assignedUsers: { $in: [email] },
  });
  const now = new Date();

  const categorize = (m: IScheduleMeeting): 'upcoming' | 'ongoing' | 'past' => {
    if (now < m.startTime) return 'upcoming';
    if (now > m.endTime) return 'past';
    return 'ongoing';
  };

  const result = meetings.map(m => ({
    meetingId: String((m as any)._id),
    title: m.title,
    description: m.description,
    startTime: m.startTime,
    endTime: m.endTime,
    googleMeetLink: m.googleMeetLink || null,
    status: categorize(m),
  }));

  return result;
};

export const ScheduleService = {
  createScheduleToDB,
  getSchedulesByEmailFromDB,
};
