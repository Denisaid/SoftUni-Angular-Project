import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {

    theme!: string;
    subscription!: Subscription;
    isUserAdmin!: boolean;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private userService: UsersService,
        private managerSession: ManagerSessionService,
        private router: Router
    ) { }

    updateNav(): boolean {

        this.isUserAdmin = this.managerSession.isUserRoleAdmin
        return this.managerSession.hasUser;
    }

    logout(): void {
        this.subscription = this.userService.logout()
            .subscribe({
                next: (data) => {
                    this.managerSession.clearSession();
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.managerSession.clearSession();
                    console.error(error.error.message)
                    this.router.navigate(['/']);
                },
            });
    }

    ngOnDestroy(): void {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}