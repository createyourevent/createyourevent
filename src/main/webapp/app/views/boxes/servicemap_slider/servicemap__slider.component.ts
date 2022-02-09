import { IServiceOffer } from './../../../entities/service-offer/service-offer.model';
import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../../../general.service';
import { SimpleChanges } from '@angular/core';
import { RideCostsService } from 'app/entities/ride-costs/service/ride-costs.service';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { ServiceOfferService } from 'app/entities/service-offer/service/service-offer.service';

@Component({
  selector: 'jhi-servicemap-slider',
  templateUrl: './servicemap_slider.component.html',
  styleUrls: ['servicemap_slider.component.scss']
})
export class ServiceMapSliderComponent implements OnChanges {
  @Input() serviceMaps: IServiceMap[] = [];
  @Input() orientation = 'horizontal';
  @Input() numVisible = 2;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '600px';
  @Input() autoplayInterval = 5000;
  @Input() style = { 'max-width': '650px', 'margin-top': '2em' };


  responsiveOptions: any[] = [];

  constructor(private router: Router,
              private rideCostsService: RideCostsService,
              private serviceOfferService: ServiceOfferService,
              private generalService: GeneralService) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serviceMaps'] !== undefined) {
      this.serviceMaps = changes['serviceMaps'].currentValue;
      this.serviceMaps.forEach(element => {
        let serviceOffers = [];
        this.generalService.getAllServiceOffersByServiceMapId(element.id!).subscribe(res => {
          serviceOffers = res.body!;
          element.serviceOffers = serviceOffers;
        });
      });
    }
  }

  total(offers: IServiceOffer[]): number {
    let total = 0;
    offers.forEach(element => {
      total += element.costHour!;
    });
    return total;
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products/' + productId + '/view']);
  }
}
