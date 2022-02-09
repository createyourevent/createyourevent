import { SharedEventService } from 'app/organisator/create-event/shared-event.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

interface Product {
  value: string,
  label: string
}

interface Service {
  value: string,
  label: string
}

@Component({
  selector: 'jhi-products-services',
  templateUrl: './products-services.component.html',
  styleUrls: ['./products-services.component.scss']
})
export class ProductsServicesComponent implements OnInit {

  products: Product[] = [
    { value: 'real_estate', label: this.translate.instant('create-event.real-estate') },
    { value: 'food', label: this.translate.instant('create-event.food') },
    { value: 'drink', label: this.translate.instant('create-event.drink') },
    { value: 'music', label: this.translate.instant('create-event.music') },
    { value: 'lightshow', label: this.translate.instant('create-event.lightshow') },
    { value: 'decoration', label: this.translate.instant('create-event.decoration') },
    { value: 'miscellaneous', label: this.translate.instant('create-event.miscellaneous') }
  ];
  services: Service[] = [
    { label: this.translate.instant('createyoureventApp.ServiceCategory.SECURITAS'), value: "SECURITAS" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.SHUTTLESERVICE'), value: "SHUTTLESERVICE" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.SANITARY'), value: "SANITARY" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.CLEANINGSERVICE'), value: "CLEANINGSERVICE" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.PLUMBER'), value: "PLUMBER" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.DISCJOKEY'), value: "DISCJOKEY" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.BAND'), value: "BAND" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.ELECTRONICSTECHNICIAN'), value: "ELECTRONICSTECHNICIAN" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.COMPUTERSCIENTIST'), value: "COMPUTERSCIENTIST" },
    { label: this.translate.instant('createyoureventApp.ServiceCategory.MISCELLANEOUS'), value: "MISCELLANEOUS" },

  ];

  constructor(private translate: TranslateService, private router: Router, public sharedEventService: SharedEventService) {}

  ngOnInit(): void {
  }

  previousState(): void {
    this.router.navigate(['/organisator/create-event/flyer']);
  }

  save(): void {
    this.router.navigate(['/organisator/create-event/select-products']);
  }


}
