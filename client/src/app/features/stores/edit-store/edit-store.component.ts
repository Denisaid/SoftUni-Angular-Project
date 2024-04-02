import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IStore } from 'src/app/models/store.interfaces';
import { ValidateStoreService } from '../validate-store.service';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
    selector: 'app-edit-store',
    templateUrl: './edit-store.component.html',
    styleUrls: ['./edit-store.component.css']
})
export class EditStoreComponent implements OnDestroy {

    @Input() storeDetails!: IStore;
    @Output() storeUpdated = new EventEmitter;

    successMessage!: string;
    errorMsgFromServer!: string;
    isLoading: boolean = false;
    subscription!: Subscription;
    imageUrl!: string;

    constructor(
        private dataService: DataService,
        private validateStore: ValidateStoreService
    ) { }

    onEditStore(formData: NgForm): void {
        const storeData: IStore = formData.value;
        const storeCheck = this.validateStore.validate(storeData);
        if (storeCheck.hasError) {
            this.errorMsgFromServer = storeCheck.error;
            return;
        }

        this.isLoading = true;
        this.subscription = this.dataService
            .updateStore(this.storeDetails._id, storeCheck.verifiedInput)
            .subscribe({
                next: (data) => {
                    this.isLoading = false;
                    this.storeDetails = data;
                    this.successMessage = `You have edited successfully ${data.name}`;
                    this.storeUpdated.emit();
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMsgFromServer = error.error.message;
                }
            });
    }

    validateImagePath(imagePath: string): void {
        this.imageUrl = this.validateStore.validateImagePath(imagePath);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}