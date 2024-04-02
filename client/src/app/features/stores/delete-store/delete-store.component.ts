import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IStore } from 'src/app/models/store.interfaces';

@Component({
    selector: 'app-delete-store',
    templateUrl: './delete-store.component.html',
    styleUrls: ['./delete-store.component.css']
})
export class DeleteStoreComponent {

    @Input() storeDetails!: IStore;

    successMessage!: string;
    errorMsgFromServer!: string;
    isLoading: boolean = false;
    disableBtnDelete: boolean = false;
    subscription!: Subscription;

    constructor(
        private router: Router,
        private dataService: DataService
    ) { }

    deleteStore(storeId: string): void {
        this.isLoading = true;
        this.subscription = this.dataService
            .deleteStore(storeId)
            .subscribe({
                next: (data) => {
                    this.isLoading = false;
                    this.disableBtnDelete = true;
                    this.successMessage = `You have successfully deleted the category ${this.storeDetails.name}`;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMsgFromServer = error.error.message;
                }
            })
    };

    onCloseModal(): void {
        if (this.successMessage) {
            this.router.navigate(['profile'])
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
}