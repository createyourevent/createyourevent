import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';

@Component({
  selector: 'jhi-service-slider',
  templateUrl: './service_slider.component.html',
  styleUrls: ['service_slider.component.scss']
})
export class ServiceSliderComponent {
  @Input() services: ICreateYourEventService[] = [];
  @Input() orientation = 'horizontal';
  @Input() numVisible = 3;
  @Input() numScroll = 1;
  @Input() circular = true;
  @Input() verticalViewPortHeight = '600px';
  @Input() autoplayInterval = 3000;
  @Input() style = { 'max-width': '650px', 'margin-top': '2em' };

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

  goToService(serviceId: number): void {
    this.router.navigate(['/services/' + serviceId + '/viewService']);
  }
}
