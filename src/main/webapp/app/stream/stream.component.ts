
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { IEvent } from "app/entities/event/event.model";
import { GeneralService } from "app/general.service";
import { OrganisatorService } from "app/organisator/organisator.service";
import * as dayjs from "dayjs";

@Component({
  selector: 'jhi-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['stream.component.scss']
})
export class StreamComponent implements OnInit, OnDestroy {

  events!: IEvent[];
  alternateSide = true;
  firstContentSide: "left" | "right" = "right";
  index = 0;
  starEvents: any[] = [];

  constructor(private generalService: GeneralService,
              private router: Router,
              private organisatorService: OrganisatorService,) {}

  ngOnInit(): void {
    this.generalService.findEventyByPrivateOrPublicAndActiveTrueAndDateEndAfter(dayjs()).subscribe(res => {
      this.events = res.body!;

      this.events.forEach(e => {
        this.organisatorService.findReservationsByEventId(e.id!).subscribe(r => {
          e.reservations = r.body;
        });

        this.generalService.getEventStarRatingByEvent(e.id!).subscribe(res => {
          const ratings = res.body!;
          let total = 0;
          ratings.forEach(el => {
            total += el.stars!;
          });
          let avg = (total / ratings.length / 10) * 5;
          if(ratings.length === 0) {
            avg = 0;
          }
          this.starEvents.push({ event: e, average: avg, total: ratings.length });
        });
      });

    });
  }

  ngOnDestroy(): void {
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/events/' + eventId + '/view']);
  }

  trackByFn(): void {
    this.index++;
  }

    // Average of the stars
    getAverage(eventId: number): number {
      const se = this.starEvents.find(x => x.event.id === eventId);
      return se.average;
    }

    getRatingsTotal(eventId: number) {
      const se = this.starEvents.find(x => x.event.id === eventId);
      return se.total;
    }

}
