import { Pipe, PipeTransform } from '@angular/core';
import { IEventProductOrder } from 'app/entities/event-product-order/event-product-order.model';
import { GeneralService } from 'app/general.service';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'checkShopActive'
})
export class CheckShopActivePipe implements PipeTransform {

  constructor(private generalService: GeneralService,) {}

  transform(shopId: number, args?: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let eventProductOrders: IEventProductOrder[] = [];
      this.generalService.findAllEventProductOrdersByShopId(shopId).subscribe(epo => {
        eventProductOrders = epo.body;
        if(eventProductOrders.length === null || eventProductOrders.length === 0) {
          resolve(false);
        }
        resolve(true);
      });
    })
  }


}
