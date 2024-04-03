import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants, endpoints } from '../../environments/constants';
import { IAllStores, IStore } from 'src/app/models/store.interfaces';
import { IOrder, IOrderWithProducts } from 'src/app/models/order.interfaces';
import { IComment } from 'src/app/models/comment.interfaces';
import { IProduct } from 'src/app/models/product.interfaces';

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

    deleteStore(storeId: string): Observable<IStore> {
        const url = constants.hostBackEnd + endpoints.deleteStore(storeId);
        return this.http.delete<IStore>(url);
    }

    getUserStores(userId: string): Observable<IStore[]> {
        const url = constants.hostBackEnd + endpoints.getUserStores(userId);
        return this.http.get<IStore[]>(url);
    }

    getStoreOrders(storeId: string): Observable<IOrderWithProducts[]> {
        const url = constants.hostBackEnd + endpoints.getStoreOrders(storeId);
        return this.http.get<IOrderWithProducts[]>(url);
    }

    getStoreById(storeId: string): Observable<IStore> {
        const url = constants.hostBackEnd + endpoints.getStoreById(storeId);
        return this.http.get<IStore>(url);
    }

    createNewProduct(storeId: string, productData: IProduct): Observable<IProduct> {
        const url = constants.hostBackEnd + endpoints.addNewProduct(storeId);
        return this.http.post<IProduct>(url, productData);
    }

    getProductById(productId: string): Observable<IProduct> {
        const url = constants.hostBackEnd + endpoints.getProductById(productId);
        return this.http.get<IProduct>(url);
    }

    getAllProductsStore(storeId: string): Observable<IProduct[]> {
        const url = constants.hostBackEnd + endpoints.getAllProductsStore(storeId);
        return this.http.get<IProduct[]>(url);
    }

    updateProduct(productId: string, productData: IProduct): Observable<IProduct> {
        const url = constants.hostBackEnd + endpoints.updateProduct(productId);
        return this.http.put<IProduct>(url, productData);
    }

    deleteProduct(productId: string): Observable<{ message: string, deletedProduct: IProduct }> {
        const url = constants.hostBackEnd + endpoints.deleteProduct(productId);
        return this.http.delete<{ message: string, deletedProduct: IProduct }>(url);
    }

    addNewComment(storeId: string, commentData: IComment): Observable<IComment> {
        const url = constants.hostBackEnd + endpoints.addNewComment(storeId);
        return this.http.post<IComment>(url, commentData);
    }

    getAllCommentsStore(storeId: string): Observable<IComment[]> {
        const url = constants.hostBackEnd + endpoints.getAllCommentsStore(storeId);
        return this.http.get<IComment[]>(url);
    }

    buyFromStore(storeId: string, purchaseData: { addressDelivery: string, orders: string[], date: number }): Observable<{ addressDelivery: string, orders: string[], date: number }> {
        const url = constants.hostBackEnd + endpoints.buyFromStore(storeId);
        return this.http.post<{ addressDelivery: string, orders: string[], date: number }>(url, purchaseData);
    }

    getUserBought(userId: string): Observable<IOrderWithProducts[]> {
        const url = constants.hostBackEnd + endpoints.getUserBought(userId);
        return this.http.get<IOrderWithProducts[]>(url);
    }

    updateOrder(orderId: string, orderData: { addressDelivery: string, orders: string[], date: number }): Observable<{ addressDelivery: string, orders: string[], date: number }> {
        const url = constants.hostBackEnd + endpoints.updateOrder(orderId);
        return this.http.put<{ addressDelivery: string, orders: string[], date: number }>(url, orderData);
    }

    deleteOrder(orderId: string): Observable<IOrder> {
        const url = constants.hostBackEnd + endpoints.deleteOrder(orderId);
        return this.http.delete<IOrder>(url);
    }
}