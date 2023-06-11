import { Post } from "./PostContent";

export interface User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: string;
    coverPhoto: string;
    active: boolean;
    posts: Post[];
}
