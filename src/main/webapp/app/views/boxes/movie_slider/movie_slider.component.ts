import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IEvent } from 'app/entities/event/event.model';
import { GeneralService } from 'app/general.service';
import { OrganisatorService } from 'app/organisator/organisator.service';

@Component({
  selector: 'jhi-movie-slider',
  templateUrl: './movie_slider.component.html',
  styleUrls: ['./movie_slider.component.scss']
})
export class MovieSliderComponent implements OnChanges {
  @Input() events: IEvent[] = [];
  @Input() orientation = 'vertical';
  @Input() numVisible = 1;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '280px';
  @Input() autoplayInterval = 10000;
  @Input() style = "{ width: '150px' }";
  loaded = false;
  starEvents: any[] = [];

  responsiveOptions: any[] = [];

  constructor(private router: Router, private organisatorService: OrganisatorService, private generalService: GeneralService) {
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
    if (changes['events'] !== undefined && changes['events'].currentValue !== undefined) {
      this.events = changes['events'].currentValue;
      this.events.forEach(element => {
        this.organisatorService.findReservationsByEventId(element.id!).subscribe(r => {
          element.reservations = r.body;
          this.loaded = true;
        });

        this.generalService.getEventStarRatingByEvent(element.id!).subscribe(res => {
          const ratings = res.body!;
          let total = 0;
          ratings.forEach(el => {
            total += el.stars!;
          });
          const avg = (total / ratings.length / 10) * 5;
          this.starEvents.push({ event: element, average: avg });
        });
      });
    }
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/events/' + eventId + '/view']);
  }

  getAverage(eventId: number): number {
    const se = this.starEvents.find(x => x.event.id === eventId);
    return se.average;
  }
}
