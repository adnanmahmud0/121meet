import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ScheduleService } from './schedule.service';

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ScheduleService.createScheduleToDB(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Meeting created successfully',
    data: result,
  });
});

const getSchedules = catchAsync(async (req: Request, res: Response) => {
  const email = String(req.query.email);
  const meetings = await ScheduleService.getSchedulesByEmailFromDB(email);

  const upcoming = meetings.filter(m => m.status === 'upcoming');
  const ongoing = meetings.filter(m => m.status === 'ongoing');
  const past = meetings.filter(m => m.status === 'past');

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Meetings fetched successfully',
    data: {
      upcoming,
      ongoing,
      past,
    },
  });
});

export const ScheduleController = {
  createSchedule,
  getSchedules,
};

