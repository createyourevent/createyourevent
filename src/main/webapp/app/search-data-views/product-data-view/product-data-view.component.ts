import { IUser } from './../../entities/user/user.model';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IProduct } from "app/entities/product/product.model";
import { IShop } from "app/entities/shop/shop.model";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";


@Component({
  selector: 'jhi-product-data-view',
  templateUrl: './product-data-view.component.html',
  styleUrls: ['./product-data-view.component.scss']
})
export class ProductDataViewComponent implements OnInit {

  constructor(private router: Router, private generalService: GeneralService, private googleGeocoderService: GoogleGeocodeService) {}

  products!: IProduct[];
  productsWithDistance: IProduct[] = [];
  sortOrder!: number;
  sortField!: string;
  starEvents: any[] = [];
  loading = false;
  distance: number;
  user: IUser;

  ngOnInit() {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
    });

    let shops: IShop[] = [];
    let products: IProduct[] = [];
    this.generalService.findShopByActiveTrueAndActiveOwnerTrue().subscribe(s => {
      shops = s.body!;
      this.loadProducts(shops).then(x => {
        x.forEach(y => {
          products = products.concat(y.products!);
        });
        this.products = products;
        this.productsWithDistance = this.products;
      });
    });
  }

  loadProducts(shops: IShop[]): Promise<IShop[]> {
    const p = new Promise<IShop[]>((resolve, reject) => {
      let i = 0;
      shops.forEach(element => {
        this.generalService.findAllProductsByShopId(element.id!).subscribe(prods => {
          i++;
          element.products = prods.body;
          element.products.forEach(p => {
            p.shop = element;
          });
          if (i === shops.length) {
            resolve(shops);
          }
        });
      });
    });
    return p;
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products/' + productId + '/view']);
  }

  changeSliderRadius(e: any): void {
    console.log(e);
    this.productsWithDistance = [];
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
        this.products.forEach(element => {
          i++;
          const queryParamShop = element.shop.address!.replace(' ', '+');
          this.googleGeocoderService.getFromAddress(queryParamShop).subscribe((resShop: any) => {
            const geocoderShop = resShop.body!['results'];
            const geometryShop = geocoderShop[0].geometry;
            latShop = geometryShop.location.lat;
            lngShop = geometryShop.location.lng;
            posShop = new google.maps.LatLng(latShop, lngShop);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posShop);
            const maxDistance = Number(e)* 1000;
            if(e === 0) {
              this.productsWithDistance = this.products;
            }
            if (maxDistance > distance) {
              this.productsWithDistance.push(element);
            }
            if (i === this.products.length) {
              this.productsWithDistance = [...new Set(this.productsWithDistance)];
            }
          });
        });
    });
  }
}
