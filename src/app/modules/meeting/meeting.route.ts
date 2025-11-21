import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { MeetingController } from './meeting.controller';
import { MeetingValidation } from './meeting.validation';
const router = express.Router();

router.post(
  '/create-meeting',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  validateRequest(MeetingValidation.createMeetingZodSchema),
  MeetingController.createMeeting
);

router.get(
  '/join/:meetingId',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  MeetingController.joinMeeting
);

export const MeetingRoutes = router;