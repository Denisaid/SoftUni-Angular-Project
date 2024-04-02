import { Component, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IProduct } from 'src/app/models/product.interfaces';
import { IStore } from 'src/app/models/store.interfaces';
import { IUserToken } from 'src/app/models/user.interfaces';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnDestroy {

    @Input() storeDetails!: IStore;
    @Input() allOrderedProducts!: { [key: string]: IProduct[] };
    @Input() summaryOrder!: { product: IProduct, qtyProduct: number, totalPriceProduct: number }[];
    @Input() totalBillCost!: number;
    @Input() currentUser!: IUserToken | null;

    errorMsgFromServer!: string;
    hasSuccessMessage: boolean = false;
    isLoading: boolean = false;
    hasBought: boolean = false;
    subscription!: Subscription;

    constructor(
        private router: Router,
        private dataService: DataService,
    ) { }

    // Pay current bill
    payBill(formData: NgForm): void {
        const addressDelivery = formData.value.addressDelivery.trim();
        if (addressDelivery.length < 5 || addressDelivery.length > 100) {
            this.errorMsgFromServer = 'The address must be between 5 and 100 characters long';
            return;
        }
        const orders = Object.entries(this.allOrderedProducts).flatMap(([productId, orders]) => Array(orders.length).fill(productId));

        const purchaseData = {
            addressDelivery,
            orders,
            date: new Date().getTime()
        };

        this.isLoading = true;
        this.subscription = this.dataService
            .buyFromStore(this.storeDetails._id, purchaseData)
            .subscribe({
                next: (data) => {
                    this.hasBought = true;
                    this.isLoading = false;
                    this.hasSuccessMessage = true;
                },
                error: (error) => this.errorMsgFromServer = error.error.message
            })
    }

    onCloseModal(): void {
        if (this.hasBought) {
            this.router.navigate(['/']);
        }

        this.hasBought = false;
    }

    redirectToProfile(): void {
        this.router.navigate(['profile']);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}