import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-delete-order',
  templateUrl: './delete-order.component.html',
  styleUrls: ['./delete-order.component.css']
})
export class DeleteOrderComponent implements OnDestroy {

  @Input() orderToDeleteId!: string;
  @Output() deletedOrder = new EventEmitter;

  successMessage!: string;
  errorMsgFromServer!: string;
  isLoading: boolean = false;
  disableBtnDelete: boolean = false;
  subscription!: Subscription;

  constructor(private dataService: DataService) { }

  deleteOrder(orderId: string): void {
    this.isLoading = true;
    this.subscription = this.dataService
      .deleteOrder(orderId)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.disableBtnDelete = true;
          this.successMessage = 'The order has been refused';
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsgFromServer = error.error.message;
        }
      })
  };

  onClose(): void {
    this.deletedOrder.emit();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };
}