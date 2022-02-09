import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPartner } from 'app/entities/partner/partner.model';

@Component({
  selector: 'jhi-partner-ads-slider',
  templateUrl: './partner_ads_slider.component.html',
  styleUrls: ['./partner_ads_slider.component.scss']
})
export class PartnerAdsSliderComponent implements OnInit, OnChanges {
  @Input() partners: IPartner[] = [];
  @Input() orientation = 'horizontal';
  @Input() numVisible = 2;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '210px';
  @Input() autoplayInterval = 10000;
  @Input() style = "{ width: '550px', height: '250px' }";
  loaded = false;
  starEvents: any[] = [];

  responsiveOptions: any[] = [];

  constructor() {
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
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partners'] !== undefined) {
      this.partners = changes['partners'].currentValue;
      this.loaded = true;
    }
  }
}
