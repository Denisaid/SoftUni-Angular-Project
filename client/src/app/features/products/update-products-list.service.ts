import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateProductsListService {
  triggerGetAllProducts = new EventEmitter<void>();
  emitTriggerGetAllProducts(): void {
    this.triggerGetAllProducts.emit();
  }
}