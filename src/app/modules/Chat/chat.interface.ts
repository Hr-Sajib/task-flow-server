import { Model } from "mongoose";

export type TChatMessage = {
  _id?: string;
  teamId: string;         // Reference to the team
  senderEmail: string;    // Email of the sender (from User model)
  message: string;
  timestamp: Date;
};

