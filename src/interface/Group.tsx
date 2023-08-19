export interface IMember {
	memberId: string;
}

export interface IGroup {
	gId: string;
	groupName: string;
	hostId: string;
	members: string[];
	status: string;
	details: string;
	coverPhoto: string;
	createAt: string;
	updateAt?: string;
}