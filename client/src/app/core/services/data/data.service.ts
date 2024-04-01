import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants, endpoints } from '../../environments/constants';
import { IAllStores, IStore } from 'src/app/models/store.interfaces';

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
}