import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";
import { IEvent } from "app/entities/event/event.model";
import { IReservation } from "app/entities/reservation/reservation.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { OrganisatorService } from "app/organisator/organisator.service";
import { JhiDataUtils } from "ng-jhipster";


@Component({
  selector: 'jhi-cross-selling-events',
  templateUrl: './crossSellingEvents.component.html',
  styleUrls: ['./crossSellingEvents.component.scss']
})
export class CrossSellingEventsComponent implements OnChanges {
  @Input() jhiEvent!: IEvent;
  users: IUser[] = [];
  allReservationsFromUsers: IReservation[] = [];
  events!: IEvent[];
  starEvents: any[] = [];
  loaded = false;

  constructor(private generalService: GeneralService, private organisatorService: OrganisatorService, protected dataUtils: JhiDataUtils) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jhiEvent'] !== undefined) {
      this.jhiEvent = changes['jhiEvent'].currentValue;

      this.loadReservations().then(() => {
        this.loadUsers().then(() => {
          this.loadReservationsFromUsers().then(() => {
            this.loadCrossSellingEvents().then(() => {
              this.loaded = true;
            });
          });
        });
      });
    }
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  loadStars(iEvent: IEvent) {
    let promise = new Promise<void>((resolve, reject) => {
      this.generalService
        .getEventStarRatingByEvent(iEvent.id!)
        .toPromise()
        .then(res => {
          const ratings = res.body!;
          let total = 0;
          ratings.forEach(el => {
            total += el.stars!;
          });
          const avg = (total / ratings.length / 10) * 5;
          this.starEvents.push({ event: iEvent, average: avg });
          resolve();
        });
    });
    return promise;
  }

  loadUsers(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      this.jhiEvent.reservations!.forEach(reservation => {
        this.users.push(reservation.user!);
      });
      resolve();
    });
    return promise;
  }

  loadReservations(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      this.organisatorService
        .findReservationsByEventId(this.jhiEvent.id!)
        .toPromise()
        .then(res => {
          this.jhiEvent.reservations = res.body;
          resolve();
        });
    });
    return promise;
  }

  loadReservationsFromUsers(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      let i = 0;
      this.users.forEach(user => {
        i++;
        this.generalService
          .getReservationsByUser(user.id)
          .toPromise()
          .then(res => {
            this.allReservationsFromUsers.push(...res.body!);
            if (i === this.users.length) {
              resolve();
            }
          });
      });
    });
    return promise;
  }

  loadCrossSellingEvents(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      const res: IReservation[] = [];
      let i = 0;
      this.allReservationsFromUsers.forEach(element => {
        i++;
        res.push(element.event!);
        this.loadReservationsFromEvent(element.event!);
        if (i === this.allReservationsFromUsers.length) {
          const u = this.getUniqueListBy(res, 'id');
          this.events = u.sort(() => Math.random() - 0.5);
          resolve();
        }
      });
    });
    return promise;
  }

  loadReservationsFromEvent(iEvent: IEvent): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      this.organisatorService
        .findReservationsByEventId(iEvent.id!)
        .toPromise()
        .then(res => {
          iEvent.reservations = res.body;
          this.loadStars(iEvent).then(() => {
            resolve();
          });
        });
    });
    return promise;
  }

  // Average of the stars
  getAverage(eventId: number): number {
    const se = this.starEvents.find(x => x.event.id === eventId);
    if (se === null || se === undefined) {
      return 0;
    }
    return se.average;
  }

  getUniqueListBy(arr: any[], key: any): IEvent[] {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  }
}
