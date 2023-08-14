import { User } from "./User";

export interface Comment {
	id: string;
	text: string;
	createdAt: string;
	author: string;
}
export interface Address {
	latitude: number;
	longtitude: number;
	address: string;
}
export interface Report {
	postId: number;
	reason: string;
	reportedBy: string;
	createdAt: Date;
}
export interface Share {
	postId: number;
	sharedBy: string;
	sharedTo: string | User;
	message?: string;
	createdAt: Date;
}
export interface Like {
	postId: number;
	likeBy: string;
	createdAt: Date;
}

export interface ShareUser {
	shareBy: string;
	shareTo: string;
	status: string;
	createdAt: string;
}

export interface PostReport {
	uid: string;
	postId: string;
	reason: string;
	createAt: string;
}

export interface Post {
	id: string;
	caption: string;
	hashTagTopic: string;
	status: string;
	photoPost: string[];
	likes: Like[];
	createAt?: string;
	date?: string;
	updateAt?: string;
	emoji?: string;
	comments: Comment[];
	reports?: Report[];
	shares?: Share[];
	location?: string;
	owner: string;
	groupName?: string;
	groupId?: string;
	shareUsers: ShareUser[];
	reportPost: PostReport[];
}