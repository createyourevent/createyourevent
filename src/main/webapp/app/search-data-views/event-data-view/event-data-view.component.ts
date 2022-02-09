import { IUser } from './../../entities/user/user.model';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IEvent } from "app/entities/event/event.model";
import { LocationService } from "app/entities/location/service/location.service";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";
import { OrganisatorService } from "app/organisator/organisator.service";
import * as dayjs from "dayjs";

@Component({
  selector: 'jhi-event-data-view',
  templateUrl: './event-data-view.component.html',
  styleUrls: ['./event-data-view.component.scss']
})
export class EventDataViewComponent implements OnInit {
  events!: IEvent[];
  sortOrder!: number;
  sortField!: string;
  starEvents: any[] = [];
  loading = false;
  eventsWithDistance: IEvent[] = [];
  user: IUser;
  distance: number;

  constructor(private generalService: GeneralService,
              private organisatorService: OrganisatorService,
              private router: Router,
              private googleGeocoderService: GoogleGeocodeService,
              private locationService: LocationService) {}

  ngOnInit() {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;

      this.generalService.findEventyByPrivateOrPublicAndActiveTrueAndDateEndAfter(dayjs()).subscribe(res => {
        this.events = res.body!;
        this.eventsWithDistance = this.events;
        this.events.forEach(element => {

          this.locationService.find(element.location.id).subscribe(l => {
            element.location = l.body;
          });

          this.organisatorService.findReservationsByEventId(element.id!).subscribe(r => {
            element.reservations = r.body;
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
      });
    });
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

  getAverage(eventId: number): number {
    const se = this.starEvents.find(x => x.event.id === eventId);
    return se.average;
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/events/' + eventId + '/view']);
  }

  changeSliderRadius(e: any): void {
    this.eventsWithDistance = [];
    let latUser = 0;
    let lngUser = 0;
    let posUser: google.maps.LatLng;
    const queryParam = this.user.address!.replace(' ', '+');
    this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
      const geocoder = res.body!['results'];
      const geometry = geocoder[0].geometry;
      latUser = geometry.location.lat;
      lngUser = geometry.location.lng;
      posUser = new google.maps.LatLng(latUser, lngUser);

      const now = dayjs();
      this.events.forEach(element => {
        const lat: number = element.location.address.lat;
        const lng: number = element.location.address.lng;
        const posEvent = new google.maps.LatLng(lat, lng);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posEvent);
        const maxDistance = Number(e) * 1000;
        if(e === 0) {
          this.eventsWithDistance = this.events;
        }
        if (maxDistance > distance) {
          this.eventsWithDistance.push(element);
        }
      });
      this.eventsWithDistance = [...new Set(this.eventsWithDistance)];
    });
  };
}
