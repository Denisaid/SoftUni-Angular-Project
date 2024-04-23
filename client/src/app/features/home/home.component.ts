import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { constants } from 'src/app/core/environments/constants';
import { DataService } from 'src/app/core/services/data/data.service';
import { IStore } from 'src/app/models/store.interfaces';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  tittle = 'carousel';

  images=[
    {
      imageSrc: 'https://cdn.firstcry.com/education/2022/11/06094158/Toy-Names-For-Kids.jpg',
      imageAlt: 'nature1',
    },
    {
      imageSrc: 'https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2022-07/44289962475_e5c5209506_b.jpg',
      imageAlt: 'nature2',
    },
    {
      imageSrc: 'https://hips.hearstapps.com/goodhousekeeping-uk/main/embedded/40137/toybox.jpg?crop=1xw:0.5625xh;center,top&resize=1200:*',
      imageAlt: 'nature3',
    }
  ]

  isLoading: boolean = false;
  subscription!: Subscription;
  allStores: IStore[] = [];
  foundStores: IStore[] = [];
  totalPages: number = 1;
  pageNumber: number = 1;
  pageArray!: number[];
  isSubmitedSearch: boolean = false;
  errorMsgFromServer!: string;

  constructor(
    private dataService: DataService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Home');
    this.subscription = new Subscription();
    this.getStores(constants.defaultPaginationPageNum, constants.defaultPaginationLimitNum);
  }

  getStores(page: string, limit: string) {
    this.isLoading = true;

    const observAllStores$ = this.dataService.getStoresByPagination(page, limit)
      .subscribe({
        next: (data) => {
          this.allStores = data.stores;
          this.totalPages = data.totalPages;
          this.pageNumber = data.page;
          this.pageArray = Array(this.totalPages).fill(0).map((x, i) => i + 1);
          this.isLoading = false;
        },
        error: (error) => this.errorMsgFromServer = error.error.message,
        complete: () => this.isLoading = false
      });

    this.subscription.add(observAllStores$);
  }

  onSearch(form: NgForm) {
    if (this.isValidForm(form)) {
      this.isLoading = true;
      const { storeName } = form.value;
      const observStoreBySearch$ = this.dataService.getStoresBySearch(storeName)
        .subscribe({
          next: (data) => {
            this.foundStores = data;
            this.isLoading = false;
            this.isSubmitedSearch = this.foundStores.length === 0;
          },
          error: (error) => {
            this.errorMsgFromServer = error.error.message;
            this.isLoading = false;
          }
        });

      this.subscription.add(observStoreBySearch$);
    }
  }

  getVisiblePageNumbers(): number[] {
    let visiblePages = [];

    visiblePages.push(this.pageNumber);

    const maxVisiblePages = 5;
    const totalPages = this.totalPages;
    const currentPage = this.pageNumber;

    let pagesToAdd = maxVisiblePages - 1;

    for (let i = currentPage - 1; i >= 1 && pagesToAdd > 0; i--) {
      visiblePages.unshift(i);
      pagesToAdd--;
    }

    for (let i = currentPage + 1; i <= totalPages && pagesToAdd > 0; i++) {
      visiblePages.push(i);
      pagesToAdd--;
    }

    return visiblePages;
  }

  goToPage(page: number): void {
    const pageToStr = String(page);
    this.getStores(pageToStr, constants.defaultPaginationLimitNum);
  }

  isValidForm(form: NgForm): boolean {
    const storeName = form.value.storeName;

    const isStoreNameValid = storeName && storeName.trim().length >= 1;

    return isStoreNameValid;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}