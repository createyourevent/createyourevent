import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedChatService } from "app/chat.service";
import { IEventProductRatingComment } from "app/entities/event-product-rating-comment/event-product-rating-comment.model";
import { EventProductRatingCommentService } from "app/entities/event-product-rating-comment/service/event-product-rating-comment.service";
import { IEventProductRating } from "app/entities/event-product-rating/event-product-rating.model";
import { EventProductRatingService } from "app/entities/event-product-rating/service/event-product-rating.service";
import { IEvent } from "app/entities/event/event.model";
import { IProduct } from "app/entities/product/product.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { EventService as EventUserService } from "../event.service";


@Component({
  selector: 'jhi-admin-comments-event-product',
  templateUrl: './admin-comments-event-product.component.html',
  styleUrls: ['admin-comments-event-product.component.scss']
})
export class AdminCommentsEventProductComponent implements OnInit {
  event!: IEvent;
  product!: IProduct;
  comments: IEventProductRatingComment[] = [];
  userLoggedIn!: IUser;
  likes: IEventProductRating[] = [];
  dislikes: IEventProductRating[] = [];
  likeDislikes!: IEventProductRating[];


  constructor(public activeModal: NgbActiveModal,
              private eventUserService: EventUserService,
              private eventProductRatingCommentService: EventProductRatingCommentService,
              private generalService: GeneralService,
              private sharedChatService: SharedChatService,
              private eventProductRatingService: EventProductRatingService) {}
  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.userLoggedIn = u.body!;
    });
    this.eventUserService.findEventProductRatingCommentByEventAndProduct(this.event.id!, this.product.id!).subscribe(res => {
      this.comments = res.body!;
    });
    this.eventProductRatingService.query().subscribe(res => {
      this.likeDislikes = res.body!;
      this.likeDislikes.forEach(element => {
        if(element.like === 1) {
          this.likes.push(element);
        }else if(element.dislike === 1) {
          this.dislikes.push(element);
        }
      });
    });
  }

  deleteComment(id: number): void {
    this.comments = this.comments.filter(element => element.id !== id);
    this.eventProductRatingCommentService.delete(id).subscribe();
  }

  deleteLikes(id: number): void {
    this.likes = this.likes.filter(element => element.id !== id);
    this.eventProductRatingService.delete(id).subscribe();
  }

  deleteDislikes(id: number): void {
    this.dislikes = this.dislikes.filter(element => element.id !== id);
    this.eventProductRatingService.delete(id).subscribe();
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }
}
