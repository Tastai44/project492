import { Post } from "./PostContent";

export interface User {
    uid: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: string;
    coverPhoto: string;
    active: boolean;
    aboutMe: string;
    faculty: string;
    instagram: string;
    status: string;
    year: number;
    posts: Post[];
}
