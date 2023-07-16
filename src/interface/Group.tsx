export interface IMember {
    uid: string;
    username: string;
}

export interface IGroup {
    gId: string;
    groupName: string;
    hostId: string;
    members: IMember[];
    status: string;
    details: string;
    coverPhoto: string;
    createAt: string;
    updateAt?: string;
}