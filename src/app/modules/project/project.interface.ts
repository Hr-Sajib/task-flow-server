export interface IProject {
    _id: string;
    projectId: string;
    projectName: string;
    projectDescription: string;
    station: string;
    clientId: string;
    projectValue: number;
    deadline: Date;
    cancellationNote: string;
    teamName: string; // আপাতত string রাখা হয়েছে যদিও পরবর্তীতে team এর module কমপ্লিট হবার পর সেখান থেকে ডায়নামিক অপশন ইউজ করা হবে 
    frontendRoleAssignedTo: string; // আপাতত string রাখা হয়েছে যদিও পরবর্তীতে team এর module কমপ্লিট হবার পর সেখান থেকে ডায়নামিক অপশন ইউজ করা হবে 
    backendRoleAssignedTo: string; // আপাতত string রাখা হয়েছে যদিও পরবর্তীতে team এর module কমপ্লিট হবার পর সেখান থেকে ডায়নামিক অপশন ইউজ করা হবে 
    uiRoleAssignedTo: string; // আপাতত string রাখা হয়েছে যদিও পরবর্তীতে team এর module কমপ্লিট হবার পর সেখান থেকে ডায়নামিক অপশন ইউজ করা হবে 
    lastUpdate: Date;
    lastMeeting: Date;
    projectStatus: "ui/ux" | "wip" | "new" | "qa" | "delivered" | "revision" | "cancelled";
    estimatedDelivery: "thisMonth" | "thisWeek" | "nextMonth";
    rating: "1" | "2" | "3" | "4" | "5" | "noRating";
    clientStatus: "active" | "inactive" | "satisfied" | "unsatisfied" | "angry" | "neutral";
    figmaLink: string;
    backendLink: string;
    liveLink: string;
    deliveryDate: Date;
    requirementDoc: string;
    notes: Array<{ noteProvider: string; noteText: string }>;
}

