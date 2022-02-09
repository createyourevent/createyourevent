import { IPartner } from './../entities/partner/partner.model';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'webaddress'
})
export class WebaddressPartnerPipe implements PipeTransform {
  transform(partner: IPartner, args?: any): any {
    return partner.webaddress;
  }
}
