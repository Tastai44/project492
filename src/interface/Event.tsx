import { ShareUser } from "./PostContent";

export interface Interest {
	eventId: number;
	interestBy: string;
	createdAt: Date;
}

export interface EventReport {
	reportBy: string;
	eventId: string;
	reason: string;
	createAt: string;
}

export interface Location {
	address: string;
	link: string;
}

export interface EventPost {
	eventId: string;
	title: string;
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
	location?: string;
	topic: string;
	ageRage: number;
	details: string;
	status: string;
	coverPhoto: string;
	interest: Interest[];
	shareUsers: ShareUser[];
	owner: string;
	createAt?: string;
	updateAt?: string;
	reportEvent: EventReport[];
}

