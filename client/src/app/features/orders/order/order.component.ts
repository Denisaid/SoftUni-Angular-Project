import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { IProduct } from 'src/app/models/product.interfaces';
import { IStore } from 'src/app/models/store.interfaces';
import { IUserToken } from 'src/app/models/user.interfaces';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

    subscription!: Subscription;
    storeId!: string;
    errorMsgFromServer!: string;
    isLoading: boolean = false;
    isFoundResult: boolean = false;
    hasUser!: boolean;
    isRoleAdmin!: boolean;
    currentUser!: IUserToken | null;
    storeDetails!: IStore;
    allProducts!: IProduct[];
    currentProducts!: IProduct[];
    allOrderedProducts: { [key: string]: IProduct[] } = {};
    allActiveGroups: Set<string> = new Set();
    totalBillCost: number = 0;
    summaryOrder: { product: IProduct, qtyProduct: number, totalPriceProduct: number }[] = [];

    constructor(
        private title: Title,
        private dataService: DataService,
        private managerSession: ManagerSessionService,
        private activeRoutes: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.title.setTitle('Order');

        this.currentUser = this.managerSession.getSessionToken();
        this.hasUser = this.managerSession.hasUser;
        this.storeId = this.activeRoutes.snapshot.params['storeId'];
        // Get details for store
        this.isLoading = true;
        this.subscription = forkJoin([
            this.dataService.getStoreById(this.storeId),
            this.dataService.getAllProductsStore(this.storeId)
        ]).subscribe({
            next: ([storeData, productsData]) => {
                this.isLoading = false;
                this.isRoleAdmin = this.managerSession.isUserRoleAdmin;
                this.storeDetails = storeData;
                this.allProducts = productsData;
                this.allProducts.forEach(p => this.allActiveGroups.add(p.material));
                this.currentProducts = [...this.allProducts];
            },
            error: (error) => {
                this.errorMsgFromServer = error.error.message;
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    orderProduct(product: IProduct): void {
        if (this.allOrderedProducts.hasOwnProperty(product._id) === false) {
            this.allOrderedProducts[product._id] = [];
        }

        this.allOrderedProducts[product._id].push(product);
        this.calculateBill();
    }

    addMoreProduct(product: IProduct): void {
        if (this.allOrderedProducts[product._id]) {
            this.allOrderedProducts[product._id].push(product);
            this.calculateBill();
        }
    }

    removeProduct(product: IProduct): void {
        if (this.allOrderedProducts[product._id]) {
            this.allOrderedProducts[product._id].pop();

            if (this.allOrderedProducts[product._id].length === 0) {
                this.deleteProduct(product);
            } else {
                this.calculateBill();
            }
        }
    }

    deleteProduct(product: IProduct): void {
        if (this.allOrderedProducts[product._id]) {
            delete this.allOrderedProducts[product._id];
            this.calculateBill();
        }
    }

    private calculateBill(): void {
        if (Object.keys(this.allOrderedProducts).length !== 0) {

            this.summaryOrder = Object.keys(this.allOrderedProducts).map(key => {
                return {
                    product: this.allOrderedProducts[key][0],
                    qtyProduct: this.allOrderedProducts[key].length,
                    totalPriceProduct: this.allOrderedProducts[key].reduce((acc, currValue) => {
                        return acc + currValue.price;
                    }, 0)
                };
            });

            this.totalBillCost = this.summaryOrder.reduce((acc, value) => { return acc + value.totalPriceProduct }, 0)
        } else {
            this.summaryOrder = [];
            this.totalBillCost = 0;
        }
    }

    filteredByCategory(categoryName: string): void {
        this.currentProducts = categoryName !== ''
            ? this.allProducts.filter(product => product.material === categoryName)
            : this.allProducts.slice();
    }

    onSearch(searchStr: string): void {
        if (isNaN(Number(searchStr))) {
            this.currentProducts = this.allProducts.filter(product => product.name.toLocaleLowerCase().includes(searchStr.toLocaleLowerCase()));
        } else {
            this.currentProducts = this.allProducts.filter(product => product.price.toString().includes(searchStr));
        }

        this.isFoundResult = this.currentProducts.length === 0;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}