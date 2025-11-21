import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MeetingService } from './meeting.service';

const createMeeting = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await MeetingService.createMeetingToDB(user, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Meeting created successfully',
      data: {
        id: result.roomId,
        joinLink: result.joinLink,
        meetingType: result.meetingType,
      },
    });
  }
);

const joinMeeting = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const meetingId = req.params.meetingId;
  const data = await MeetingService.getAgoraAccessTokenFromDB(user, meetingId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Token generated successfully',
    data,
  });
});

const myMeetings = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const meetings = await MeetingService.getMyMeetingsToDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Meetings fetched successfully',
    data: { meetings },
  });
});

export const MeetingController = { createMeeting, joinMeeting, myMeetings };
