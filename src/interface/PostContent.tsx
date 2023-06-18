import { User } from "./User";

export interface Comment {
  id: string;
  text: string;
  createAt:string;
  author: string;
}
export interface Location {
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

export interface Post {
  id: string;
  caption: string;
  hashTagTopic: string;
  status: string;
  photoPost: string[];
  likeNumber: number;
  createAt: string;
  emoji?: string;
  comments?: Comment[];
  reports?: Report[];
  shares?: Share[];
  location?: Location;
  owner: string;
}

export interface todos {
  id: string;
  content: string;
  title: string;
}
