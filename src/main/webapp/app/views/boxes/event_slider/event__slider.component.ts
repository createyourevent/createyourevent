import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { GeneralService } from 'app/general.service';
import { OrganisatorService } from 'app/organisator/organisator.service';

@Component({
  selector: 'jhi-event-slider',
  templateUrl: './event_slider.component.html',
  styleUrls: ['event_slider.component.scss']
})
export class EventSliderComponent implements OnChanges {
  @Input() events: IEvent[] = [];
  @Input() orientation = 'horizontal';
  @Input() numVisible = 3;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '600px';
  @Input() autoplayInterval = 10000;
  @Input() style = "{ width: '1180px' }";
  loaded = false;
  starEvents: any[] = [];

  responsiveOptions: any[] = [];

  constructor(
    private router: Router,
    private eventService: EventService,
    private organisatorService: OrganisatorService,
    private generalService: GeneralService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] !== undefined) {
      this.events = changes['events'].currentValue;
      this.events.forEach(element => {
        this.organisatorService.findReservationsByEventId(element.id!).subscribe(r => {

          element.reservations = r.body;
          if(element.reservations === null) {
            element.reservations = [];
          }

          this.generalService.getEventStarRatingByEvent(element.id!).subscribe(res => {
            const ratings = res.body!;
            let total = 0;
            ratings.forEach(el => {
              total += el.stars!;
            });
            let avg = (total / ratings.length / 10) * 5;
            if(ratings.length === 0) {
              avg = 0;
            }
            this.starEvents.push({ event: element, average: avg, total: ratings.length });
            this.loaded = true;
          });
        });
      });
    }
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/events/' + eventId + '/view']);
  }

  getDate(eventId: number): string {
    let datecde = '';
    this.eventService.find(eventId).subscribe(e => {
      datecde = e.body!.dateStart!.format('YYYY-MM-DD hh:mm:ss');
    });
    return datecde;
  }
  // Average of the stars
  getAverage(eventId: number): number {
    if(this.loaded) {
      const se = this.starEvents.find(x => x.event.id === eventId);
      return se.average;
    }
  }

  getRatingsTotal(eventId: number) {
    if(this.loaded) {
      const se = this.starEvents.find(x => x.event.id === eventId);
      return se.total;
    }
  }

}
