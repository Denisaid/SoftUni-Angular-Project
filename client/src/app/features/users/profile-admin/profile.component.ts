import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, mergeMap } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { Title } from '@angular/platform-browser';

import { IStore } from 'src/app/models/store.interfaces';
import { IUser } from 'src/app/models/user.interfaces';
import { IOrderWithProducts } from 'src/app/models/order.interfaces';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

    userDetails!: IUser;
    isRoleAdmin!: boolean;
    subscription!: Subscription;
    userStores: IStore[] = [];
    errorMsgFromServer!: string;
    isLoading: boolean = false;
    statistics: { storeId: string, storeName: string, totalProfit: number, totalCountSell: number, bestSellers: string[] }[] = [];

    constructor(
        private title: Title,
        private dataService: DataService,
        private managerSession: ManagerSessionService
    ) { }


    ngOnInit(): void {
        this.title.setTitle('Profile');

        const hasUser = this.managerSession.getSessionToken();
        if (hasUser) {
            this.userDetails = hasUser.userDetails;
        }

        this.isRoleAdmin = this.managerSession.isUserRoleAdmin;
        if (hasUser && this.isRoleAdmin) {
            this.isLoading = true;
            this.subscription = this.dataService.getUserStores(this.userDetails._id)
                .pipe(
                    mergeMap(allStores => allStores),
                    mergeMap(store => {
                        this.userStores.push(store);
                        return this.dataService.getStoreOrders(store._id)
                            .pipe(
                                mergeMap(order => {
                                    const totalBills = order.map((order) => order.orders.reduce((acc, curPrice) => acc + curPrice.price, 0));
                                    this.statistics.push({
                                        storeId: store._id,
                                        storeName: store.name,
                                        totalProfit: totalBills.reduce((acc, bill) => acc + bill, 0),
                                        totalCountSell: order.length,
                                        bestSellers: this.findTopSellingProducts(order),
                                    });

                                    return this.statistics;
                                })
                            );
                    }),
                )
                .subscribe({
                    next: (data) => {
                        this.statistics.sort((a, b) => b.totalProfit - a.totalProfit);
                        this.isLoading = false;
                    },
                    error: (error) => {
                        this.errorMsgFromServer = error.error.message;
                        this.isLoading = false;
                    },
                    complete: () => this.isLoading = false
                });
        }
    }

    private findTopSellingProducts(allOrders: IOrderWithProducts[]): string[] {
        const bestSellersCount = 5;

        const productCount: { [key: string]: number } = {};
        allOrders.forEach((currentOrder) => {
            currentOrder.orders.forEach((order) => {
                if (productCount[order.name]) {
                    productCount[order.name]++;
                } else {
                    productCount[order.name] = 1;
                }
            });
        });

        const countedProducts = Object.entries(productCount);
        countedProducts.sort((a, b) => b[1] - a[1]);
        const bestSellers = countedProducts
            .slice(0, bestSellersCount)
            .map((entry) => entry[0])
            .map((product) => `- ${product}`);

        return bestSellers;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}