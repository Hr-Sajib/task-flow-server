import { Model } from "mongoose";

export type TChatMessage = {
  _id?: string;
  teamId: string;         // Refer to the team
  senderEmail: string;    
  message: string;
  timestamp: Date;
};

