import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SharedChatService } from "app/chat.service";
import { EventLikeDislikeService } from "app/entities/event-like-dislike/service/event-like-dislike.service";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {

  eventId!: number;
  jhiEvent!: IEvent;
  user!: IUser;
  likes: any[] = [];
  dislikes: any[] = [];

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private eventLikeDislikeService: EventLikeDislikeService
  ) {}


  ngOnInit(): void {
    this.route.parent!.params.subscribe(params => {
      this.eventId = params['eventId'];

      this.eventService.find(this.eventId).subscribe(ev => {
        this.jhiEvent = ev.body!;

        this.generalService.findWidthAuthorities().subscribe(user => {
          this.user = user.body!;

          this.generalService.findEventLikeDislikeByEventId(this.jhiEvent.id!).subscribe(res => {
            res.body!.forEach(element => {
              if (element.like === 1) {
                this.likes.push(element);
              }
              if (element.dislike === 1) {
                this.dislikes.push(element);
              }
            });
          });
        });
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  onDeleteDislikes(id: number): void {
    this.eventLikeDislikeService.delete(id).subscribe();
  }

  onDeleteLikes(id: number): void {
    this.eventLikeDislikeService.delete(id).subscribe();
  }
}
