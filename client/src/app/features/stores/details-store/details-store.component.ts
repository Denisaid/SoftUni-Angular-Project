import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, mergeMap } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IComment } from 'src/app/models/comment.interfaces';
import { IStore } from 'src/app/models/store.interfaces';

@Component({
    selector: 'app-details-store',
    templateUrl: './details-store.component.html',
    styleUrls: ['./details-store.component.css']
})
export class DetailsStoreComponent implements OnInit, OnDestroy {

    subscription!: Subscription;
    storeDetails!: IStore;
    storeId!: string;
    isLoading: boolean = false;
    errorMsgFromServer!: string;
    allComments: IComment[] = [];

    constructor(
        private title: Title,
        private dataService: DataService,
        private activeRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.title.setTitle('Details');
        this.getStoreDetails();
    }

    refreshStoreDetails(): void {
        this.getStoreDetails();
    }

    private getStoreDetails(): void {
        this.storeId = this.activeRoute.snapshot.params['storeId'];
        this.isLoading = true;
        this.subscription = this.dataService.getStoreById(this.storeId)
            .pipe(
                mergeMap(store => {
                    this.storeDetails = store;
                    return this.dataService.getAllCommentsStore(store._id)
                        .pipe(
                            mergeMap(comments => this.allComments = comments.slice(-5).reverse())
                        )
                })
            ).subscribe({
                next: (data) => this.isLoading = false,
                error: (error) => {
                    this.errorMsgFromServer = error.error.message;
                    this.isLoading = false;
                },
                complete: () => this.isLoading = false,
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}