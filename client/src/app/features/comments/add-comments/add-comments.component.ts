import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data/data.service';
import { ManagerSessionService } from 'src/app/core/services/users/manager-session.service';
import { IComment } from 'src/app/models/comment.interfaces';
import { IStore } from 'src/app/models/store.interfaces';

@Component({
  selector: 'app-add-comments',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() storeDetails!: IStore;
  @Input() isRoleAdmin!: boolean;

  allComments!: IComment[];
  subscription!: Subscription;
  errorMsgFromServer!: string;
  isLoading!: boolean;
  userId!: string | undefined;

  constructor(
    private dataService: DataService,
    private managerSession: ManagerSessionService,
  ) { }

  ngOnInit(): void {
    this.userId = this.managerSession.getSessionToken()?.userDetails._id;

    this.getAllComments();
  }

  updateComment(): void {
    this.getAllComments();
  }

  postComment(formData: NgForm): void {
    if (this.storeDetails.owner._id === this.userId) {
      this.errorMsgFromServer = 'Comment not allowed - You are an administrator';
      return;
    }

    const comment = formData.value;
    comment.comment = comment.comment.trim();
    if (comment.comment.length < 5 || comment.comment.length > 300) {
      this.errorMsgFromServer = 'The comment must be between 5 and 300 characters';
      return;
    }

    this.isLoading = true;
    this.subscription = this.dataService
      .addNewComment(this.storeDetails._id, comment)
      .subscribe({
        next: (data) => this.isLoading = false,
        error: (error) => {
          this.errorMsgFromServer = error.error.message;
          this.isLoading = false;
        },
        complete: () => {
          this.getAllComments()
          this.isLoading = false;
        },
      });
  }

  private getAllComments(): void {
    this.isLoading = true;
    this.subscription = this.dataService
      .getAllCommentsStore(this.storeDetails._id)
      .subscribe({
        next: (data) => {
          this.allComments = data.reverse();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMsgFromServer = error.error.message;
          this.isLoading = false;
        },
        complete: () => this.isLoading = false
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}