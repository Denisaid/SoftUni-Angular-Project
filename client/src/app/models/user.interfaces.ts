export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    password: string;
};

export interface IUserToken {
    accessToken: string;
    userDetails: IUser;
};