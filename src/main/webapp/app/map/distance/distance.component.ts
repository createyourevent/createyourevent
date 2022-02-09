import { LocationService } from './../../entities/location/service/location.service';

import { Component, OnInit } from "@angular/core";
import { IEvent } from "app/entities/event/event.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";
import * as dayjs from "dayjs";

@Component({
  selector: 'jhi-distance',
  templateUrl: './distance.component.html',
  styleUrls: ['distance.component.scss']
})
export class DistanceComponent implements OnInit {
  user!: IUser;
  allEvents!: IEvent[];
  eventsWithDistance: IEvent[] = [];
  distance = 0;

  constructor(private generalService: GeneralService,
              private googleGeocoderService: GoogleGeocodeService,
              private locationService: LocationService) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;
    });
  }

  changeSliderRadius(e: any): void {
    this.allEvents = [];
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
      this.generalService.findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(now).subscribe(events => {
        this.allEvents = events.body!;

        let i = 0;
        this.allEvents.forEach(element => {
          i++;
          this.locationService.find(element.location.id).subscribe(l => {
            element.location = l.body;
            const lat: number = element.location.address.lat;
            const lng: number = element.location.address.lng;
            const posEvent = new google.maps.LatLng(lat, lng);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posEvent);
            const maxDistance = this.distance * 1000;
            if (maxDistance > distance) {
              this.eventsWithDistance.push(element);
            }
            if(i === this.allEvents.length) {
              this.eventsWithDistance = [].concat(this.eventsWithDistance);
            }
          });
        });
      });
    });
  }
}
