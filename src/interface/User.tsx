import { Post } from "./PostContent";

export interface User {
	uid: string;
	username: string;
	userRole?: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePhoto?: string;
	coverPhoto?: string;
	aboutMe: string;
	faculty: string;
	instagram: string;
	status?: string;
	year: string;
	isActive?: boolean;
	posts?: Post[];
	friendList?: IFriendList[];
	createdAt?: string;
}

export interface IFriendList {
	friendId: string;
	createdAt: string;
}

export interface IUserLocalStorage {
	student_id: string,
	firstname_EN: string,
	lastname_EN: string;
}

export interface IUserReturnFromToken {
	cmuitaccount_name: string,
	cmuitaccount: string,
	student_id: string,
	prename_id: string,
	prename_TH: string,
	prename_EN: string,
	firstname_TH: string,
	firstname_EN: string,
	lastname_TH: string,
	lastname_EN: string,
	organization_code: string,
	organization_name_TH: string,
	organization_name_EN: string,
	itaccounttype_id: string,
	itaccounttype_TH: string,
	itaccounttype_EN: string;
}
