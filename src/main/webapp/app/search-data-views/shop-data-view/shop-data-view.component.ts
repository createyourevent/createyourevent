import { IUser } from './../../entities/user/user.model';
import { ShopService } from './../../entities/shop/service/shop.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IShop } from 'app/entities/shop/shop.model';
import { GeneralService } from 'app/general.service';
import { GoogleGeocodeService } from 'app/google-geocode.service';

@Component({
  selector: 'jhi-shop-data-view',
  templateUrl: './shop-data-view.component.html',
  styleUrls: ['./shop-data-view.component.scss'],
})
export class ShopDataViewComponent implements OnInit {

  user: IUser;
  shops: IShop[];
  sortOrder!: number;
  sortField!: string;
  starEvents: any[] = [];
  loading = false;
  shopsWithDistance: IShop[] = [];
  distance: number;

  constructor(private generalService: GeneralService,
              private router: Router,
              private googleGeocoderService: GoogleGeocodeService) { }

  ngOnInit() {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
    });
    this.generalService.findShopByActiveTrueAndActiveOwnerTrue().subscribe(res => {
      this.shops = res.body;
      this.shopsWithDistance = this.shops;
      this.shops.forEach(ele => {
        const googleAddressArray = ele.address.split(',');
        const address = googleAddressArray![0];
        const place = googleAddressArray![1];
        const land = googleAddressArray![2];
        ele.address = address + "\n" + place + "\n" + land;
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

  goToShop(supplierId: number): void {
    this.router.navigate(['/supplier/shop/' + supplierId + '/overview']);
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

        let latShop = 0;
        let lngShop = 0;
        let posShop: google.maps.LatLng;
        let i = 0;
        this.shops.forEach(element => {
          i++;
          const queryParamShop = element.address!.replace(' ', '+');
          this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
            const geocoderShop = resShop.body!['results'];
            const geometryShop = geocoderShop[0].geometry;
            latShop = geometryShop.location.lat;
            lngShop = geometryShop.location.lng;
            posShop = new google.maps.LatLng(latShop, lngShop);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posShop);
            const maxDistance = Number(e)* 1000;
            if(e === 0) {
              this.shopsWithDistance = this.shops;
            }
            if (maxDistance > distance) {
              this.shopsWithDistance.push(element);
            }
            if (i === this.shops.length) {
              this.shopsWithDistance = [...new Set(this.shopsWithDistance)];
            }
          });
        });
    });
  }
}
