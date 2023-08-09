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
    active?: boolean;
    aboutMe: string;
    faculty: string;
    instagram: string;
    status?: string;
    year?: string;
    isActive?: boolean;
    posts?: Post[];
    friendList?: IFriendList[];
    createdAt?: string;
    // shareStatus: boolean
}

export interface IFriendList{
    status: boolean;
    friendId: string;
    username: string;
    profilePhoto?: string;
    createdAt: string;
}
