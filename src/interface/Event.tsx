import { Address, ShareUser } from "./PostContent";

export interface Interest {
    eventId: number;
    interestBy: string;
    createdAt: Date;
  }

export interface EventPost {
    id: string;
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location?: Address[];
    topic: string;
    ageRage: number;
    details: string;
    status: string;
    coverPhoto: string[];
    interest: Interest[];
    shareUsers: ShareUser[];
    owner: string;
    createAt?: string;
    updateAt?: string;
}

