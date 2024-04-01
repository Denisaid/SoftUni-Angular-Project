import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IOrderSummary, IOrderWithProducts } from 'src/app/models/order.interfaces';
import { IUser } from 'src/app/models/user.interfaces';

@Component({
    selector: 'app-profile-user',
    templateUrl: './profile-user.component.html',
    styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit, OnDestroy {

    @Input() userDetails!: IUser;

    allSummaryOrders!: IOrderSummary[];
    isRoleAdmin!: boolean;
    subscription!: Subscription;
    errorMsgFromServer!: string;
    isLoading: boolean = false;
    userOrders!: IOrderWithProducts[];

    constructor(
        private dataService: DataService,
    ) { }

    ngOnInit(): void {
        this.getUserOrders();
    }

    refreshUserOrdersList(): void {
        this.getUserOrders();
    }

    private getUserOrders(): void {
        this.isLoading = true;
        this.subscription = this.dataService.getUserBought(this.userDetails._id)
            .pipe(
                map(allOrders => {
                    const resultSummaryOrder = allOrders.map(currentOrder => {
                        const currentProductDetails: { [key: string]: { image: string, name: string, description: string, quantity: number, price: number, totalCost: number } } = {};

                        currentOrder.orders.forEach(orderObj => {
                            if (currentProductDetails.hasOwnProperty(orderObj._id) === false) {
                                currentProductDetails[orderObj._id] = {
                                    image: orderObj.image,
                                    name: orderObj.name,
                                    description: orderObj.description,
                                    quantity: 0,
                                    price: orderObj.price,
                                    totalCost: 0
                                };
                            }

                            currentProductDetails[orderObj._id].quantity += 1;
                            currentProductDetails[orderObj._id].totalCost += orderObj.price;
                        });

                        const currentOrderDetails = {
                            _id: currentOrder._id,
                            storeImage: currentOrder.storeId.image,
                            storeName: currentOrder.storeId.name,
                            storeCategory: currentOrder.storeId.category,
                            storeAddress: currentOrder.storeId.address,
                            storePhone: currentOrder.storeId.phone,
                            addressDelivery: currentOrder.addressDelivery,
                            date: currentOrder.date,
                            totalBillCost: currentOrder.orders.reduce((acc, currProduct) => { return acc + currProduct.price }, 0),
                            canEdit: this.canEditDeleteOrder(currentOrder.date),
                            products: Object.values(currentProductDetails)
                        };

                        return currentOrderDetails;
                    });
                    this.allSummaryOrders = resultSummaryOrder.sort((a, b) => b.date - a.date);

                    return allOrders;
                })
            )
            .subscribe({
                next: (ordersData) => {
                    this.isLoading = false;
                    this.userOrders = ordersData;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMsgFromServer = error.error.message;
                }
            });
    }

    private canEditDeleteOrder(timestampCreated: number): boolean {
        const timestampNow = new Date().getTime();
        const timeIntervalInMilliseconds = 5 * 60 * 1000;
        const timeDifferenceInMilliseconds = timestampNow - timestampCreated;

        if (timeDifferenceInMilliseconds <= timeIntervalInMilliseconds) {
            return true;
        }

        return false;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}