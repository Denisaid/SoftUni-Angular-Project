import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { translateErrorsFromServer } from 'src/app/core/environments/constants';
import { DataService } from 'src/app/core/services/data/data.service';
import { IOrderWithProducts } from 'src/app/models/order.interfaces';
import { IProduct } from 'src/app/models/product.interfaces';
import { IUser } from 'src/app/models/user.interfaces';

@Component({
    selector: 'app-edit-order',
    templateUrl: './edit-order.component.html',
    styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit, OnDestroy {

    @Input() userDetails!: IUser;
    @Input() userOrders!: IOrderWithProducts[];
    @Input() orderToEditId!: string;
    @Output() updateOrderList = new EventEmitter;

    successMessage!: string;
    errorMsgFromServer!: string;
    isLoading: boolean = false;
    subscription!: Subscription;
    orderToEdit!: IOrderWithProducts;
    totalBillCost: number = 0;
    summaryOrder: { product: IProduct, qtyProduct: number, totalPriceProduct: number }[] = [];

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        const productToEditIndex = this.userOrders.findIndex(o => o._id === this.orderToEditId);
        if (productToEditIndex != -1) {
            this.orderToEdit = this.userOrders[productToEditIndex];
            this.calculateBill();
        }
    }

    updateOrder(formData: NgForm): void {
        const addressDelivery = formData.value.addressDelivery.trim();
        if (addressDelivery.length < 5 || addressDelivery.length > 100) {
            this.errorMsgFromServer = 'The address must be between 5 and 100 characters long';
            return;
        }

        const orderData = {
            addressDelivery,
            orders: this.orderToEdit.orders.map(product => product._id),
            date: this.orderToEdit.date
        };

        this.isLoading = true;
        this.subscription = this.dataService
            .updateOrder(this.orderToEdit._id, orderData)
            .subscribe({
                next: (data) => {
                    this.isLoading = false;
                    this.successMessage = 'Order successfully edited';
                },
                error: (error) => {
                    this.errorMsgFromServer = translateErrorsFromServer.has(error.error.message)
                        ? translateErrorsFromServer.get(error.error.message)
                        : error.error.message;
                    this.isLoading = false;
                }
            })
    }

    onCloseModal(): void {
        this.updateOrderList.emit();
    }

    addMoreProduct(product: IProduct): void {
        const currentProductIndex = this.orderToEdit.orders.findIndex(p => p._id === product._id);
        this.orderToEdit.orders.splice(currentProductIndex, 0, product);
        this.calculateBill();
    }

    removeProduct(product: IProduct): void {
        const currentProductIndex = this.orderToEdit.orders.findIndex(p => p._id === product._id);
        if (currentProductIndex != -1) {
            this.orderToEdit.orders.splice(currentProductIndex, 1);
            this.calculateBill();
        }
    }

    deleteProduct(product: IProduct): void {
        if (this.orderToEdit.orders.some(p => p._id === product._id)) {
            this.orderToEdit.orders = this.orderToEdit.orders.filter(p => p._id !== product._id);
            this.calculateBill();
        }
    }

    private calculateBill(): void {
        if (this.orderToEdit.orders.length !== 0) {
            const currentProductsDetails: { [_id: string]: { product: IProduct, quantity: number, price: number, totalCost: number } } = {};

            this.orderToEdit.orders.forEach(productObj => {
                if (currentProductsDetails.hasOwnProperty(productObj._id) === false) {
                    currentProductsDetails[productObj._id] = {
                        product: productObj,
                        quantity: 0,
                        price: productObj.price,
                        totalCost: 0
                    };
                }

                currentProductsDetails[productObj._id].quantity += 1;
                currentProductsDetails[productObj._id].totalCost += productObj.price;
            });

            this.summaryOrder = Object.values(currentProductsDetails).map(product => {
                return {
                    product: product.product,
                    qtyProduct: product.quantity,
                    totalPriceProduct: product.totalCost
                };
            });

            this.totalBillCost = this.summaryOrder.reduce((acc, value) => { return acc + value.totalPriceProduct }, 0)
        } else {
            this.summaryOrder = [];
            this.totalBillCost = 0;
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
}