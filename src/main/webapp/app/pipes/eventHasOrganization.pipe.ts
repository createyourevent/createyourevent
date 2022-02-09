import { IPartner } from './../entities/partner/partner.model';
import { Pipe, PipeTransform } from '@angular/core';
import { GeneralService } from 'app/general.service';
@Pipe({
  name: 'eventHasOrganization'
})
export class EventHasOrganizationPipe implements PipeTransform {

  constructor(private generalService: GeneralService) {}

  transform(eventId: number, args?: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.generalService.findOrganizationReservationsByEventId(eventId).subscribe(resreservations => {
        const reservations = resreservations.body;
        if(reservations === null || reservations.length === 0 ) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
    });
  }
}
