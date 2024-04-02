import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants, endpoints } from '../../environments/constants';
import { IAllStores, IStore } from 'src/app/models/store.interfaces';
import { IOrderWithProducts } from 'src/app/models/order.interfaces';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private http: HttpClient) { }

    getStoresByPagination(page: string, limit: string): Observable<IAllStores> {
        const url = constants.hostBackEnd + endpoints.getAllStores(page, limit);
        return this.http.get<IAllStores>(url);
    }

    getStoresBySearch(storeName: string): Observable<IStore[]> {
        const url = constants.hostBackEnd + endpoints.getStoresBySearch(storeName);
        return this.http.get<IStore[]>(url);
    }

    createStore(userInput: IStore): Observable<IStore> {
        const url = constants.hostBackEnd + endpoints.addNewStore;
        return this.http.post<IStore>(url, userInput);
    }

    updateStore(storeId: string, storeData: IStore): Observable<IStore> {
        const url = constants.hostBackEnd + endpoints.updateStore(storeId);
        return this.http.put<IStore>(url, storeData);
    }

    getUserStores(userId: string): Observable<IStore[]> {
        const url = constants.hostBackEnd + endpoints.getUserStores(userId);
        return this.http.get<IStore[]>(url);
    }

    getStoreById(storeId: string): Observable<IStore> {
        const url = constants.hostBackEnd + endpoints.getStoreById(storeId);
        return this.http.get<IStore>(url);
    }

    getAllCommentsStore(storeId: string): Observable<IComment[]> {
        const url = constants.hostBackEnd + endpoints.getAllCommentsStore(storeId);
        return this.http.get<IComment[]>(url);
    }

    getUserBought(userId: string): Observable<IOrderWithProducts[]> {
        const url = constants.hostBackEnd + endpoints.getUserBought(userId);
        return this.http.get<IOrderWithProducts[]>(url);
    }
}