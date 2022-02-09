import { OnDestroy, Component, OnInit } from '@angular/core';
import { GeneralService } from '../general.service';
import { GoogleGeocodeService } from 'app/google-geocode.service';
import * as dayjs from "dayjs";
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IEvent } from 'app/entities/event/event.model';
import { IShop } from 'app/entities/shop/shop.model';

@Component({
  selector: 'jhi-map',
  templateUrl: './map.component.html',
  styleUrls: ['map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  options: any;
  events!: IEvent[];
  shops!: IShop[];
  services!: ICreateYourEventService[];
  overlays: any[] = [];

  constructor(private generalService: GeneralService, private googleGeocoderService: GoogleGeocodeService) {}

  ngOnInit(): void {
    this.options = {
      center: { lat: 47.7233, lng: 8.66429 },
      zoom: 12
    };

    const now = dayjs();
    this.generalService.findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(now).subscribe(res => {
      this.events = res.body!;

      this.events.forEach(e => {
        const marker = new google.maps.Marker({
          position: { lat: Number(e.location?.address?.lat!), lng: Number(e.location?.address?.lng!) },
          title: e.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
          }
        });
        marker.addListener('click', function(): void {
          window.location.href = '/events/' + e.id + '/view';
        });
        this.overlays.push(marker);
      });
    });

    this.generalService.findShopByActiveTrueAndActiveOwnerTrue().subscribe(res => {
      this.shops = res.body!;

      this.shops.forEach(e => {
        let pos: google.maps.LatLng;
        const queryParam = e.address!.replace(' ', '+');
        this.googleGeocoderService.getFromAddress(queryParam).subscribe((re: any) => {
          const geocoder = re.body!['results'];
          const geometry = geocoder[0].geometry;
          pos = new google.maps.LatLng(geometry.location.lat, geometry.location.lng);

          const marker = new google.maps.Marker({
            position: { lat: pos.lat(), lng: pos.lng() },
            title: e.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
          });
          marker.addListener('click', function(): void {
            window.location.href = '/supplier/shop/' + e.id + '/overview';
          });
          this.overlays.push(marker);
        });
      });
    });

    this.generalService.getServicesWhereActiveAndActiveOwnerTrue().subscribe(res => {
      this.services = res.body!;

      this.services.forEach(e => {
        let pos: google.maps.LatLng;
        const queryParam = e.address!.replace(' ', '+');
        this.googleGeocoderService.getFromAddress(queryParam).subscribe((re: any) => {
          const geocoder = re.body!['results'];
          const geometry = geocoder[0].geometry;
          pos = new google.maps.LatLng(geometry.location.lat, geometry.location.lng);

          const marker = new google.maps.Marker({
            position: { lat: pos.lat(), lng: pos.lng() },
            title: e.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
          });
          marker.addListener('click', function(): void {
            window.location.href = '/events/' + e.id + '/view';
          });
          this.overlays.push(marker);
        });
      });
    });
  }

  ngOnDestroy(): void {}
}
