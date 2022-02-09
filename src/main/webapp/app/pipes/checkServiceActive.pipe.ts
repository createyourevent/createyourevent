import { Pipe, PipeTransform } from '@angular/core';
import { IEventServiceMapOrder } from 'app/entities/event-service-map-order/event-service-map-order.model';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { GeneralService } from 'app/general.service';

@Pipe({
  name: 'checkServiceActive'
})
export class CheckServiceActivePipe implements PipeTransform {

  constructor(private generalService: GeneralService,) {}

  transform(serviceId: number, args?: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let serviceMaps: IServiceMap[] = [];
      let serviceOrders: IEventServiceMapOrder[] = [];
      this.generalService.findByCreateYourEventServiceId(serviceId).subscribe(s => {
        serviceMaps = s.body;
        let i = 0;
        if(serviceMaps === null || serviceMaps.length === 0) {
          resolve(false);
        }
        serviceMaps.forEach(e => {
          this.generalService.getAllEventServiceMapsOrdersByServiceMapId(e.id).subscribe(o => {
            i++;
            serviceOrders = o.body;
            if(serviceOrders.length === null || serviceOrders.length === 0) {
              resolve(false);
            }
            if(i === serviceMaps.length) {
              resolve(true);
            }
          });
        });
      });
    })
  }


}
