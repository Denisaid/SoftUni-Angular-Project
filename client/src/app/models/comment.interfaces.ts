import { IUser } from "./user.interfaces";

export interface IComment {
    _id: string;
    storeId: string;
    userId: IUser;
    comment: string;
};