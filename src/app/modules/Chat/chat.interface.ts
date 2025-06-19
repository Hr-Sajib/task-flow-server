
export type TChatMessage = {
  _id?: string;
  teamName: string;        
  senderEmail: string;    
  messages: Tmessage[];
};

type Tmessage = {
  timestamp: Date;
  messageText: string;
  sender: string;
}