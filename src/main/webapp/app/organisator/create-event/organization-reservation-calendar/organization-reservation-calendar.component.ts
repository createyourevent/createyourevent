import { AfterViewInit, Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CalendarOptions, Calendar } from '@fullcalendar/core';


@Component({
  selector: 'jhi-organization-reservation-calendar',
  templateUrl: './organization-reservation-calendar.component.html',
  styleUrls: ['./organization-reservation-calendar.component.scss']
})
export class OrganizationReservationCalendarComponent implements OnInit, AfterViewInit {


  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth'
  };

  constructor(public config: DynamicDialogConfig) { }
  ngAfterViewInit(): void {
    this.config.data.organization.organizationReservations.forEach((res => {
      this.fullcalendar.getApi().addEvent({title: res.event.name, start: new Date(res.dateFrom), end: new Date(res.dateUntil)});
    }))
    this.fullcalendar.getApi().setOption('locale', 'de')
    this.fullcalendar.getApi().render();
  }

  ngOnInit() {
    forwardRef(() => Calendar);
  }

}
