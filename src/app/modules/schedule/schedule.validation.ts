import { z } from 'zod';

const createScheduleZodSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, { message: 'Title is required' }),
      description: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      isInstantMeeting: z.boolean().default(false),
      assignedUsers: z
        .array(z.string().email({ message: 'Invalid email in assignedUsers' }))
        .default([]),
    })
    .refine(
      data => data.isInstantMeeting || (!!data.startTime && !!data.endTime),
      {
        message: 'startTime and endTime are required when isInstantMeeting is false',
        path: ['startTime'],
      }
    ),
});

const getSchedulesZodSchema = z.object({
  query: z.object({
    email: z.string().email({ message: 'Valid email is required' }),
  }),
});

export const ScheduleValidation = {
  createScheduleZodSchema,
  getSchedulesZodSchema,
};

