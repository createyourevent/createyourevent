import { Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PayTicketComponent } from './payTicket/payTicket.component';
import { TicketsComponent } from './tickets.component';

export const ticketsRoute: Routes = [{
  path: '',
  component: TicketsComponent,
  data: {
    authorities: [Authority.USER],
    pageTitle: 'title.print-at-home'
  },
  canActivate: [UserRouteAccessService]
},
{
  path: ':reservationId/payTicket',
  component: PayTicketComponent,
  data: {
    authorities: [Authority.USER],
    pageTitle: 'title.print-at-home'
  },
  canActivate: [UserRouteAccessService]
}
];
