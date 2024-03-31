import { Component, Input } from '@angular/core';
import { IStore } from 'src/app/models/store.interfaces';

@Component({
  selector: 'app-card-store',
  templateUrl: './card-store.component.html',
  styleUrls: ['./card-store.component.css']
})
export class CardStoreComponent {
  @Input() store!: IStore;
  @Input() profile: boolean = false;
}
