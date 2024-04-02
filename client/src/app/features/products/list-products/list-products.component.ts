import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IProduct } from 'src/app/models/product.interfaces';
import { UpdateProductsListService } from '../update-products-list.service';


@Component({
    selector: 'app-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit, OnDestroy {
    @Input() storeId!: string;

    isLoading: boolean = false;
    errorMsgFromServer!: string;
    subscription!: Subscription;
    allProducts!: IProduct[];
    isShownProducts: boolean = false;
    currentProducts!: IProduct[];
    isFoundResult: boolean = false;
    productsPerPage = 10;
    currentPage = 1;
    totalPages = 0;
    pages: number[] = [];

    constructor(
        private dataService: DataService,
        private updateProductsList: UpdateProductsListService,
    ) { }

    ngOnInit(): void {
        this.getAllProducts();
        this.subscribeToTriggerGetAllProducts()
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.productToDisplay();
        }
    }

    onSearch(searchStr: string): void {
        if (isNaN(Number(searchStr))) {
            this.currentProducts = this.allProducts.filter(product => product.name.toLocaleLowerCase().includes(searchStr.toLocaleLowerCase()));
        } else {
            this.currentProducts = this.allProducts.filter(product => product.price.toString().includes(searchStr));
        }

        this.isFoundResult = this.currentProducts.length === 0;
    }

    changeProductsToShow(newValue: string): void {
        if (newValue) {
            const valueToNumber = Number(newValue);
            this.productsPerPage = valueToNumber === -1 ? this.allProducts.length : valueToNumber;
        } else {
            this.productsPerPage = 10;
        }

        this.calculateTotalPages(this.allProducts.length);
        this.updatePageRange();
        this.productToDisplay();
        this.goToPage(1);
    }

    sortProductsBy(criteria: string): void {
        if (criteria === '') {
            this.currentProducts = [...this.allProducts];

        } else {
            const productToSort = [...this.allProducts];
            this.currentProducts = productToSort.sort((a, b) => {
                if (criteria === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (criteria === 'material') {
                    return a.material.localeCompare(b.material);
                } else if (criteria === 'priceASC') {
                    return a.price - b.price;
                } else if (criteria === 'priceDSC') {
                    return b.price - a.price;
                }

                return 0;
            });
        }
    }

    private getAllProducts(): void {
        this.isLoading = true;
        this.subscription = this.dataService
            .getAllProductsStore(this.storeId).
            subscribe({
                next: (productsData) => {
                    this.isLoading = false;
                    this.allProducts = productsData;
                    this.isShownProducts = this.allProducts.length !== 0;
                    this.calculateTotalPages(this.allProducts.length);
                    this.updatePageRange();
                    this.productToDisplay();
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMsgFromServer = error.error.message;
                }
            });
    }

    private calculateTotalPages(totalProducts: number): void {
        this.totalPages = Math.ceil(totalProducts / this.productsPerPage);
    }

    private updatePageRange(): void {
        this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }

    private productToDisplay(): void {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        this.currentProducts = this.allProducts.slice(startIndex, endIndex);
    }

    private subscribeToTriggerGetAllProducts(): void {
        this.updateProductsList.triggerGetAllProducts.subscribe(() => {
            this.getAllProducts();
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}