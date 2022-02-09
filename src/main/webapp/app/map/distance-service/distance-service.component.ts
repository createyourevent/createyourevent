import { Component, OnInit } from "@angular/core";
import { ICreateYourEventService } from "app/entities/create-your-event-service/create-your-event-service.model";
import { IShop } from "app/entities/shop/shop.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";


@Component({
  selector: 'jhi-distance-service',
  templateUrl: './distance-service.component.html',
  styleUrls: ['distance-service.component.scss']
})
export class DistanceServiceComponent implements OnInit {
  user!: IUser;
  allServices!: ICreateYourEventService[];
  servicesWithDistance: IShop[] = [];
  distance = 0;

  constructor(private generalService: GeneralService, private googleGeocoderService: GoogleGeocodeService) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;
    });
  }

  changeSliderRadius(e: any): void {
    console.log(e);
    this.servicesWithDistance = [];
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

      this.generalService.getServicesWhereActiveAndActiveOwnerTrue().subscribe(services => {
        this.allServices = services.body!;
        let latService = 0;
        let lngService = 0;
        let posService: google.maps.LatLng;
        let i = 0;
        this.allServices.forEach(element => {
          i++;
          const queryParamShop = element.address!.replace(' ', '+');
          this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
            const geocoderShop = resShop.body!['results'];
            const geometryShop = geocoderShop[0].geometry;
            latService = geometryShop.location.lat;
            lngService = geometryShop.location.lng;
            posService = new google.maps.LatLng(latService, lngService);

            const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posService);
            const maxDistance = this.distance * 1000;
            if (maxDistance > distance) {
              this.servicesWithDistance.push(element);
            }
            if(i === this.allServices.length) {
              this.servicesWithDistance = [].concat(this.servicesWithDistance);
            }
          });
        });
      });
    });
  }
}
