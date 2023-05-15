import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationReservationCalendarComponent } from './organization-reservation-calendar.component';
import { SharedModule } from 'app/shared/shared.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

@NgModule({
  imports: [CommonModule, SharedModule, FullCalendarModule],
  declarations: [OrganizationReservationCalendarComponent],
})
export class OrganizationReservationCalendarModule {}
