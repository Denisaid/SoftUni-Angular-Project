import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IProduct } from 'src/app/models/product.interfaces';
import { UpdateProductsListService } from '../update-products-list.service';

@Component({
    selector: 'app-delete-product',
    templateUrl: './delete-product.component.html',
    styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnDestroy {

    @Input() productDetails!: IProduct;

    successMessage!: string;
    errorMsgFromServer!: string;
    isLoading: boolean = false;
    subscription!: Subscription;
    disableBtnDelete: boolean = false;

    constructor(
        private dataService: DataService,
        private updateProductList: UpdateProductsListService,
    ) { }

    deleteProduct(productId: string): void {
        this.isLoading = true;
        this.subscription = this.dataService
            .deleteProduct(productId)
            .subscribe({
                next: (data) => {
                    this.isLoading = false;
                    this.disableBtnDelete = true;
                    this.successMessage = `You have successfully deleted ${data.deletedProduct.name}`;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMsgFromServer = error.error.message;
                }
            })
    }

    onCloseModal(): void {
        this.updateProductList.emitTriggerGetAllProducts();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}