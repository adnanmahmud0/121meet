import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ScheduleController } from './schedule.controller';
import { ScheduleValidation } from './schedule.validation';

const router = express.Router();

router.post(
  '/meetings',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  validateRequest(ScheduleValidation.createScheduleZodSchema),
  ScheduleController.createSchedule
);

router.get(
  '/meetings',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  validateRequest(ScheduleValidation.getSchedulesZodSchema),
  ScheduleController.getSchedules
);

export const ScheduleRoutes = router;

