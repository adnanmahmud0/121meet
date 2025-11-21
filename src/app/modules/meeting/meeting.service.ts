import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import { User } from '../user/user.model';
import { IMeeting } from './meeting.interface';
import { Meeting } from './meeting.model';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

const createMeetingToDB = async (
  user: JwtPayload,
  payload: {
    title?: string;
    participantId: string;
    meetingType: 'scheduled' | 'instant';
    startTime?: string;
    endTime?: string;
  }
): Promise<IMeeting> => {
  const creatorId = user.id;
  const participant = await User.findById(payload.participantId);
  if (!participant) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Participant doesn't exist!");
  }

  const roomId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const meetingDoc = await Meeting.create({
    title: payload.title,
    creator: creatorId,
    participant: participant._id,
    meetingType: payload.meetingType,
    startTime: payload.startTime ? new Date(payload.startTime) : undefined,
    endTime: payload.endTime ? new Date(payload.endTime) : undefined,
    roomId,
    joinLink: `http://${config.ip_address}:${config.port}/api/v1/meetings/join/${roomId}`,
  });

  const creator = await User.findById(creatorId);

  const details = {
    title: meetingDoc.title || 'Meeting',
    meetingType: meetingDoc.meetingType,
    startTime: meetingDoc.startTime,
    endTime: meetingDoc.endTime,
    joinLink: meetingDoc.joinLink,
  };

  const creatorEmail = emailTemplate.meetingInvite({
    to: creator!.email,
    title: details.title,
    meetingType: details.meetingType,
    startTime: details.startTime,
    endTime: details.endTime,
    joinLink: details.joinLink,
    warning: 'Only assigned users can join',
  });
  const participantEmail = emailTemplate.meetingInvite({
    to: participant.email!,
    title: details.title,
    meetingType: details.meetingType,
    startTime: details.startTime,
    endTime: details.endTime,
    joinLink: details.joinLink,
    warning: 'Only assigned users can join',
  });
  emailHelper.sendEmail(creatorEmail);
  emailHelper.sendEmail(participantEmail);

  return meetingDoc;
};

const getAgoraAccessTokenFromDB = async (
  user: JwtPayload,
  meetingId: string
) => {
  const meeting = await Meeting.findOne({ roomId: meetingId });
  if (!meeting) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
  }
  const authorized =
    String(meeting.creator) === String(user.id) ||
    String(meeting.participant) === String(user.id);
  if (!authorized) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Not authorized to join');
  }

  if (!config.agora?.app_id || !config.agora?.app_certificate) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Agora config missing');
  }

  const appID = config.agora.app_id as string;
  const appCertificate = config.agora.app_certificate as string;
  const channelName = meeting.roomId;
  const uid = 0;
  const role = RtcRole.PUBLISHER;
  const expireTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  return { token, channelName };
};

export const MeetingService = {
  createMeetingToDB,
  getAgoraAccessTokenFromDB,
};