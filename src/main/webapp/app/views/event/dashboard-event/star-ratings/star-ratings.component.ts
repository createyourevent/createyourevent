import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SharedChatService } from "app/chat.service";
import { IEventStarRating } from "app/entities/event-star-rating/event-star-rating.model";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-star-ratings',
  templateUrl: './star-ratings.component.html',
  styleUrls: ['./star-ratings.component.scss']
})
export class StarRatingsComponent implements OnInit {

  eventId!: number;
  jhiEvent!: IEvent;
  user!: IUser;
  eventStarRatings!: IEventStarRating[];
  heartVal = 0;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private sharedChatService: SharedChatService,
  ) {}


  ngOnInit(): void {
    this.route.parent!.params.subscribe(params => {
      this.eventId = params['eventId'];

      this.eventService.find(this.eventId).subscribe(ev => {
        this.jhiEvent = ev.body!;

        this.generalService.findWidthAuthorities().subscribe(user => {
          this.user = user.body!;

          this.generalService.getEventStarRatingByEvent(this.eventId).subscribe(esrs => {
            this.eventStarRatings = esrs.body!;

            let total = 0;
            this.eventStarRatings.forEach(element => {
              total += element.stars!;
            });
            this.heartVal = total / this.eventStarRatings.length / 10 * 5;
          });

        });
      });
    });
  }

  onRowSelect(event: any): void {
    this.sharedChatService.callClickName(event.user);
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

  previousState(): void {
    window.history.back();
  }

}
