import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { CardStoreComponent } from './card-store/card-store.component';
import { BublesAnimationComponent } from './bubles-animation/bubles-animation.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { SuccessMessageComponent } from './success-message/success-message.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    CardStoreComponent,
    BublesAnimationComponent,
    AlertMessageComponent,
    SuccessMessageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    CardStoreComponent,
    BublesAnimationComponent,
    AlertMessageComponent,
    SuccessMessageComponent,
  ]
})
export class SharedModule { }
