import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IEvent } from 'app/entities/event/event.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-organization-has-events',
  templateUrl: './organization-has-events.component.html',
  styleUrls: ['./organization-has-events.component.scss']
})
export class OrganizationHasEventsComponent implements OnChanges {

  sortOrder!: number;
  sortField!: string;
  starEvents: any[] = [];
  loading = false;
  @Input() events: IEvent[] = [];
  user: IUser;

  constructor(private router: Router, private generalService: GeneralService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;
    if (changes['events'] !== undefined) {
      this.events = changes['events'].currentValue;
      this.loading = false;
      this.events.forEach(element => {
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


  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

}
