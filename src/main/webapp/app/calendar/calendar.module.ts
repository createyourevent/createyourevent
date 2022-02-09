import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';

import { CalendarDateFormatter, CalendarModule, CalendarMomentDateFormatter, DateAdapter, MOMENT } from 'angular-calendar';
import * as dayjs from "dayjs";
import * as moment from "moment";
import { adapterFactory } from 'angular-calendar/date-adapters/moment';

import { CalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { CALENDAR_ROUTE } from './calendar.route';
import { SharedModule } from 'app/shared/shared.module';

import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';

export function momentAdapterFactory(): DateAdapter {
  return adapterFactory(moment);
}

registerLocaleData(localeDe);
registerLocaleData(localeEn);

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild([CALENDAR_ROUTE]),
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter
        }
      }
    )
  ],
  exports: [CalendarComponent, RouterModule],
  providers: [
    {
      provide: MOMENT,
      useValue: moment
    }
  ]
})
export class EventCalendarModule {}
