
export type TTeamChat = {
  teamName: string;          
  messages: TMessage[];
};

type TMessage = {
  timestamp: Date;
  messageText: string;
  senderName: string;
  senderEmail: string;
}