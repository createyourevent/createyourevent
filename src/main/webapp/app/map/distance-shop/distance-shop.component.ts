import { Component, OnInit } from "@angular/core";
import { IShop } from "app/entities/shop/shop.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";


@Component({
  selector: 'jhi-distance-shop',
  templateUrl: './distance-shop.component.html',
  styleUrls: ['distance-shop.component.scss']
})
export class DistanceShopComponent implements OnInit {
  user!: IUser;
  allShops!: IShop[];
  shopsWithDistance: IShop[] = [];
  distance = 0;

  constructor(private generalService: GeneralService, private googleGeocoderService: GoogleGeocodeService) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;
    });
  }

  changeSliderRadius(e: any): void {
    console.log(e);
    this.shopsWithDistance = [];
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

      this.generalService.findShopByActiveTrueAndActiveOwnerTrue().subscribe(shops => {
        this.allShops = shops.body!;
        let latShop = 0;
        let lngShop = 0;
        let posShop: google.maps.LatLng;
        this.allShops.forEach(element => {
          const queryParamShop = element.address!.replace(' ', '+');
          this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
            const geocoderShop = resShop.body!['results'];
            const geometryShop = geocoderShop[0].geometry;
            latShop = geometryShop.location.lat;
            lngShop = geometryShop.location.lng;
            posShop = new google.maps.LatLng(latShop, lngShop);

            const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posShop);
            const maxDistance = this.distance * 1000;
            if (maxDistance > distance) {
              this.shopsWithDistance.push(element);
            }
          });
        });
      });
    });
  }
}
