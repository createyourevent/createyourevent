import { Pipe, PipeTransform } from '@angular/core';
import { GeneralService } from 'app/general.service';
import { OrganisatorService } from 'app/organisator/organisator.service';

@Pipe({
  name: 'totalTickets'
})
export class TotalTicketsPipe implements PipeTransform {

  constructor(private generalService: GeneralService, private organisatorService: OrganisatorService) {}

  transform(eventId: number, args?: any): any {
    return new Promise<any>((resolve, reject) => {
      this.generalService.findEventById(eventId).subscribe(e => {
        this.organisatorService.findReservationsByEventId(e.body.id).subscribe(r => {

          const element = e.body;
          element.reservations = r.body;

          if(element.reservations === null) {
            element.reservations = [];
          }
          let total = 0;
          element.reservations.forEach(res => {
            total += res.ticket.amount;
          });
          resolve(total);
        });
      });
    });
  }
}
