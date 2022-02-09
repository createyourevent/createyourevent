import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IOrganization } from 'app/entities/organization/organization.model';

@Component({
  selector: 'jhi-organization-slider',
  templateUrl: './organization_slider.component.html',
  styleUrls: ['./organization_slider.component.scss']
})
export class Organization_sliderComponent {

  @Input() organizations: IOrganization[] = [];
  @Input() orientation = 'horizontal';
  @Input() numVisible = 3;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '600px';
  @Input() autoplayInterval = 3000;
  @Input() style = "{ 'max-width': '1180px' }";

  responsiveOptions: any[] = [];

  constructor(private router: Router) {
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

  formatAddress(org: IOrganization): string {
    const googleAddressArray = org.address!.split(',');
    const address = googleAddressArray![0];
    const place = googleAddressArray![1];
    const land = googleAddressArray![2];
    const fa = (address + '\n' + place + '\n' + land).trim();
    return fa;
  }

  goToOrganization(organizationId: number): void {
    this.router.navigate(['/organization/' + organizationId + '/view']);
  }
}
