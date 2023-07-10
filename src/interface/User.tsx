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
    posts: Post[];
}
