import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RegisterComponent } from './features/users/register/register.component';
import { LoginComponent } from './features/users/login/login.component';
import { AddStoreComponent } from './features/stores/add-store/add-store.component';
import { ProfileComponent } from './features/users/profile-admin/profile.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { DetailsStoreComponent } from './features/stores/details-store/details-store.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { onlyForGuestGuard } from './core/guards/only-for-guest.guard';
import { onlyForLoggedInGuard } from './core/guards/only-for-logged-in.guard';
import { OrderComponent } from './features/orders/order/order.component';
import { onlyForAdminGuard } from './core/guards/only-for-admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', canActivate: [onlyForGuestGuard], component: LoginComponent },
  { path: 'register', canActivate: [onlyForGuestGuard], component: RegisterComponent },
  { path: 'add-stores', canActivate: [onlyForLoggedInGuard, onlyForAdminGuard], component: AddStoreComponent },
  { path: 'profile', canActivate: [onlyForLoggedInGuard], component: ProfileComponent },
  { path: 'details/:storeId', canActivate: [onlyForLoggedInGuard, onlyForAdminGuard], component: DetailsStoreComponent },
  { path: 'orders/:storeId', component: OrderComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }