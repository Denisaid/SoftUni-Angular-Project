import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { IStore } from 'src/app/models/store.interfaces';
import { ValidateStoreService } from '../validate-store.service';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css']
})
export class AddStoreComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  errorMsgFromServer!: string;
  isLoading: boolean = false;

  constructor(
    private title: Title,
    private router: Router,
    private dataService: DataService,
    private validateStore: ValidateStoreService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Category');
  }

  createStore(formData: NgForm): void {
    const userInput: IStore = formData.value;
    const storeCheck = this.validateStore.validate(userInput);
    if (storeCheck.hasError) {
      this.errorMsgFromServer = storeCheck.error;
      return;
    }

    this.isLoading = true;
    this.subscription = this.dataService.createStore(storeCheck.verifiedInput)
      .subscribe({
        next: (data) => {
          formData.reset();
          this.isLoading = false;
          this.router.navigate(['details', data._id]);
        },
        error: (error) => {
          this.errorMsgFromServer = error.error.message;
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}