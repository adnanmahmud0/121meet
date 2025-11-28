import { FilterQuery } from 'mongoose';
import { ScheduleMeeting, IScheduleMeeting } from './schedule.model';

const create = async (payload: Partial<IScheduleMeeting>) => {
  const doc = await ScheduleMeeting.create(payload);
  return doc;
};

const find = async (filter: FilterQuery<IScheduleMeeting>) => {
  const docs = await ScheduleMeeting.find(filter).sort('-createdAt');
  return docs;
};

export const ScheduleRepository = {
  create,
  find,
};

