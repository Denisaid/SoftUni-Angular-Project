import { IUser } from "./user.interfaces";

export interface IStore {
    _id: string;
    name: string;
    category: string;
    address: string;
    phone: string;
    cuisine: string;
    description: string;
    image: string;
    owner: IUser
}

export interface IAllStores {
    stores: IStore[],
    page: number;
    totalPages: number;
}