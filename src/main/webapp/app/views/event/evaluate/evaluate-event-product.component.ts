import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SharedChatService } from "app/chat.service";
import { IEventProductRatingComment, EventProductRatingComment } from "app/entities/event-product-rating-comment/event-product-rating-comment.model";
import { EventProductRatingCommentService } from "app/entities/event-product-rating-comment/service/event-product-rating-comment.service";
import { EventProductRating, IEventProductRating } from "app/entities/event-product-rating/event-product-rating.model";
import { EventProductRatingService } from "app/entities/event-product-rating/service/event-product-rating.service";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IProduct } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { Subject } from "rxjs";
import { EventService as EventUserService } from "../event.service";
import * as dayjs from "dayjs";


@Component({
  selector: 'jhi-event-product-rating',
  templateUrl: './evaluate-event-product.component.html',
  styleUrls: ['./evaluate-event-product.component.scss']
})
export class EventToProductRatingComponent implements OnInit {
  event!: IEvent;
  product!: IProduct;
  user!: IUser;
  userLoggedIn!: IUser;

  userRated = false;

  likes = 0;
  dislikes = 0;

  commentText = new FormControl(null, Validators.required);
  rating!: EventProductRating;
  comments: IEventProductRatingComment[] = [];
  isSaving = false;

  refresh: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private eventUserService: EventUserService,
    private eventService: EventService,
    private productService: ProductService,
    private eventProductRatingService: EventProductRatingService,
    private eventProductRatingCommentService: EventProductRatingCommentService,
    private generalService: GeneralService,
    private sharedChatService: SharedChatService,
  ) {}

  ngOnInit(): void {
    let eventId: number, productId: number;
    this.route.params.subscribe(params => {
      eventId = params['eventId'];
      productId = params['productId'];

      this.eventService.find(eventId).subscribe(event => {
        this.event = event.body!;
        this.productService.find(productId).subscribe(product => {
          this.product = product.body!;
          this.generalService.findWidthAuthorities().subscribe(user => {
            this.user = user.body!;
            this.userLoggedIn = user.body!;

            this.calculateLikes();
            this.calculateDislikes();

            this.eventUserService
              .findEventProductRatingByEventAndProductAndUser(this.event.id!, this.product.id!, this.user.id)
              .subscribe(res => {
                this.rating = res.body!;
              });
            this.eventUserService.findEventProductRatingCommentByEventAndProduct(this.event.id!, this.product.id!).subscribe(res => {
              this.comments = res.body!;
            });
          });
        });
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  saveComment(): void {
    const eventProductRatingComment: IEventProductRatingComment = new EventProductRatingComment();
    eventProductRatingComment.comment = this.commentText.value;
    eventProductRatingComment.event = this.event;
    eventProductRatingComment.product = this.product;
    eventProductRatingComment.user = this.user;
    eventProductRatingComment.date = dayjs();
    this.eventProductRatingCommentService.create(eventProductRatingComment).subscribe(() => {
      this.comments.push(eventProductRatingComment);
      this.commentText.reset();
      this.refresh.next();
    });
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

  like(): void {
    const rating = new EventProductRating();
    rating.like = 1;
    rating.dislike = 0;
    rating.event = this.event;
    rating.product = this.product;
    rating.user = this.user;
    this.eventProductRatingService.create(rating).subscribe(() => {
      this.likes++;
      this.rating = rating;
      this.refresh.next();
    });
  }

  dislike(): void {
    const rating = new EventProductRating();
    rating.like = 0;
    rating.dislike = 1;
    rating.event = this.event;
    rating.product = this.product;
    rating.user = this.user;
    this.eventProductRatingService.create(rating).subscribe(() => {
      this.dislikes++;
      this.rating = rating;
      this.refresh.next();
    });
  }

  calculateLikes(): void {
    let l: IEventProductRating[];
    this.generalService.findEventProductRatingsByEventIdAndProductId(this.event.id!, this.product.id!).subscribe(likes => {
      l = likes.body!;
      l.forEach(element => {
        this.likes += element.like!;
        this.refresh.next();
      });
    });
  }

  calculateDislikes(): void {
    let l: IEventProductRating[];
    this.generalService.findEventProductRatingsByEventIdAndProductId(this.event.id!, this.product.id!).subscribe(dislikes => {
      l = dislikes.body!;
      l.forEach(element => {
        this.dislikes += element.dislike!;
        this.refresh.next();
      });
    });
  }
}
