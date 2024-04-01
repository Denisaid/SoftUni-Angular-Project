import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RegisterComponent } from './features/users/register/register.component';
import { LoginComponent } from './features/users/login/login.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { onlyForGuestGuard } from './core/guards/only-for-guest.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', canActivate: [onlyForGuestGuard], component: LoginComponent },
  { path: 'register', canActivate: [onlyForGuestGuard], component: RegisterComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }