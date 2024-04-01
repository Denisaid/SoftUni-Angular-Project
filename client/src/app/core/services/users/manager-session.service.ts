import { Injectable } from '@angular/core';
import { IUserToken } from 'src/app/models/user.interfaces';
import { constants } from '../../environments/constants';

@Injectable({
    providedIn: 'root'
})
export class ManagerSessionService {

    constructor() { }

    addSession(userToken: IUserToken): void {
        localStorage.setItem(constants.userTokenName, JSON.stringify(userToken));
    }

    getSessionToken(): IUserToken | null {
        const userToken = localStorage.getItem(constants.userTokenName);
        if (userToken) {
            return JSON.parse(userToken);
        }

        return null;
    }

    clearSession(): void {
        localStorage.removeItem(constants.userTokenName);
    }

    get userRole(): string | null {
        const token = this.getSessionToken();
        if (token) {
            return token.userDetails.role;
        }

        return token;
    }

    get isUserRoleAdmin(): boolean {
        const token = this.getSessionToken();
        if (token && token.userDetails.role === 'admin') {

            return true;
        }

        return false;
    }

    get hasUser(): boolean {
        return localStorage.getItem(constants.userTokenName) ? true : false;
    }
}