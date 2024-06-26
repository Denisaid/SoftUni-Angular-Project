import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { IProduct } from 'src/app/models/product.interfaces';
import { ValidateProductService } from '../validate-product.service';
import { DataService } from 'src/app/core/services/data/data.service';
import { UpdateProductsListService } from '../update-products-list.service';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnDestroy {

    @Input() productDetails!: IProduct;

    successMessage!: string;
    errorMsgFromServer!: string;
    isLoading: boolean = false;
    subscription!: Subscription;
    imageUrl!: string;

    constructor(
        private validateProduct: ValidateProductService,
        private dataService: DataService,
        private updateProductList: UpdateProductsListService,
    ) { }

    editProduct(formData: NgForm): void {
        const productData: IProduct = formData.value;
        const validatedProduct = this.validateProduct.validate(productData);
        if (validatedProduct.hasError) {
            this.errorMsgFromServer = validatedProduct.error;
            return;
        }

        this.isLoading = true;
        this.subscription = this.dataService
            .updateProduct(this.productDetails._id, validatedProduct.verifiedInput)
            .subscribe({
                next: (data) => {
                    this.isLoading = false;
                    this.productDetails = data;
                    this.successMessage = `You have edited successfully ${data.name}`;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMsgFromServer = error.error.message;
                }
            });

    }

    validateImagePath(imagePath: string): void {
        this.imageUrl = this.validateProduct.validateImagePath(imagePath);
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