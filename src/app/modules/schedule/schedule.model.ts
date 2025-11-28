import { model, Schema, Types } from 'mongoose';

export type IScheduleMeeting = {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isInstantMeeting: boolean;
  assignedUsers: string[];
  googleEventId?: string;
  googleMeetLink?: string;
  createdBy: Types.ObjectId;
};

const scheduleMeetingSchema = new Schema<IScheduleMeeting>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isInstantMeeting: { type: Boolean, default: false },
    assignedUsers: { type: [String], default: [] },
    googleEventId: { type: String },
    googleMeetLink: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const ScheduleMeeting = model<IScheduleMeeting>(
  'ScheduleMeeting',
  scheduleMeetingSchema
);

