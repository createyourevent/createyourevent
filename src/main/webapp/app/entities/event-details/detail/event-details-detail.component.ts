import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventDetails } from '../event-details.model';

@Component({
  selector: 'jhi-event-details-detail',
  templateUrl: './event-details-detail.component.html',
})
export class EventDetailsDetailComponent implements OnInit {
  eventDetails: IEventDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventDetails }) => {
      this.eventDetails = eventDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
