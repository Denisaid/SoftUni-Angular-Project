import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { CardStoreComponent } from './card-store/card-store.component';
import { CarouselComponent } from './carousel/carousel.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    CardStoreComponent,
    CarouselComponent,
    AlertMessageComponent,
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
    CarouselComponent,
    AlertMessageComponent,
  ]
})
export class SharedModule { }
