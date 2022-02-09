import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import * as dayjs from "dayjs";
import { ReservedEventsService } from './reserved-events.service';

@Component({
  selector: 'jhi-reserved-events',
  templateUrl: './reserved-events.component.html',
  styleUrls: ['./reserved-events.component.scss']
})
export class ReservedEventsComponent implements OnInit {

  isShowFavorits = false;
  user: IUser;
  reservedEvents: IEvent[] = [];


  constructor(private generalService: GeneralService,
              private router: Router,
              private eventService: EventService,
              private reservedEventsService: ReservedEventsService) { }

  ngOnInit() {
    this.reservedEventsService.favoriteAddedEmitter.subscribe((data: IEvent) => {
      this.reservedEvents = [];
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body;
        this.generalService.findEventyByPrivateOrPublicAndActiveTrueAndDateEndAfter(dayjs()).subscribe(e => {
          const events = e.body;
          let i = 0;
          events.forEach(event => {
            i++;
            const found = event.reservedUsers.findIndex(x => x.id === this.user.id);
            if(found >= 0) {
              const foundEvent = this.reservedEvents.findIndex(x => x.id === event.id);
              if(foundEvent < 0) {
                this.reservedEvents.push(event);
              }
            }
            if(i === events.length) {
              if(this.reservedEvents.length === 0) {
                this.isShowFavorits = false;
              }
              else {
                this.isShowFavorits = true;
              }
            }
          });
        });
      });
    });
    this.reservedEvents = [];
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.generalService.findEventyByPrivateOrPublicAndActiveTrueAndDateEndAfter(dayjs()).subscribe(e => {
        const events = e.body;
        events.forEach(event => {
          const found = event.reservedUsers.findIndex(x => x.id === this.user.id);
          if(found >= 0) {
            const foundEvent = this.reservedEvents.findIndex(x => x.id === event.id);
            if(foundEvent < 0) {
              this.reservedEvents.push(event);
            }
          }
        });
      });
    });
  }

  openFavorits(): void {
    if(this.numberEvents() > 0) {
      this.isShowFavorits = !this.isShowFavorits;
    }
  }

  numberEvents(): number {
    return this.reservedEvents.length;
  }

  gotoEvent(id: number): void {
    this.router.navigate(['/events/' + id + '/view']);
  }

  removeFromFavorits(id: number) {
    this.eventService.find(id).subscribe(e => {
      const event = e.body;
      const found = event.reservedUsers.findIndex(user => user.id === this.user.id);
      event.reservedUsers.splice(found, 1);
      this.generalService.updateEvent(event).subscribe(() => {
        this.reservedEventsService.favoriteRemoved(event);
        this.reservedEvents = [];
        this.generalService.findEventyByPrivateOrPublicAndActiveTrueAndDateEndAfter(dayjs()).subscribe(e => {
          const events = e.body;
          events.forEach(event => {
            const found = event.reservedUsers.findIndex(x => x.id === this.user.id);
            if(found >= 0) {
              const foundEvent = this.reservedEvents.findIndex(x => x.id === event.id);
              if(foundEvent < 0) {
                this.reservedEvents.push(event);
              }
            }
          });
        });
      });
    });
  }
}
