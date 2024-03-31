import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {

    theme!: string;
    subscription!: Subscription;
    isUserAdmin!: boolean;

    constructor(){

    }

    ngOnDestroy(): void {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}