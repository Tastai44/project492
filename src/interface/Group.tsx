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

export interface IShare {
	id: string;
	uid: string;
	username: string;
	profilePhoto?: string;
}