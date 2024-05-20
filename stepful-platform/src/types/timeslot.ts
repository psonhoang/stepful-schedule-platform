import { Feedback } from "./feedback";
import { User } from "./user";

export type TimeSlot = {
  id: number;
  coach: User;
  student?: User;
  startTime: string;
  endTime: string;
  feedback?: Feedback;
};
