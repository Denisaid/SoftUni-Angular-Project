import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';
import { AddStoreComponent } from './stores/add-store/add-store.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProfileComponent } from './users/profile-admin/profile.component';
import { ProfileUserComponent } from './users/profile-user/profile-user.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditStoreComponent } from './stores/edit-store/edit-store.component';
import { DetailsStoreComponent } from './stores/details-store/details-store.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        AddStoreComponent,
        AboutUsComponent,
        ProfileComponent,
        EditStoreComponent,
        DetailsStoreComponent,
        NotFoundComponent,
        ProfileUserComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class FeaturesModule { }
