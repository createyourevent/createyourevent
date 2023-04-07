import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationReservationComponent } from './list/organization-reservation.component';
import { OrganizationReservationDetailComponent } from './detail/organization-reservation-detail.component';
import { OrganizationReservationUpdateComponent } from './update/organization-reservation-update.component';
import { OrganizationReservationDeleteDialogComponent } from './delete/organization-reservation-delete-dialog.component';
import { OrganizationReservationRoutingModule } from './route/organization-reservation-routing.module';

@NgModule({
  imports: [SharedModule, OrganizationReservationRoutingModule],
  declarations: [
    OrganizationReservationComponent,
    OrganizationReservationDetailComponent,
    OrganizationReservationUpdateComponent,
    OrganizationReservationDeleteDialogComponent,
  ],
})
export class OrganizationReservationModule {}
