import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { CalendarService } from './calendar.service';
import { colors } from './colors';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { SharedLanguageChangeService } from '../layouts/navbar/SharedLanguageChangeService.service';
import { IEvent } from 'app/entities/event/event.model';

interface ExtendetCalendarEvent extends CalendarEvent {
  id: number;
}

@Component({
  selector: 'jhi-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  calendarEvents: ExtendetCalendarEvent[] = [];
  events!: IEvent[];

  activeDayIsOpen = false;

  locale = 'de';

  refresh: Subject<any> = new Subject();

  changeEventsubscription: Subscription;

  constructor(
    protected calendarService: CalendarService,
    private router: Router,
    private languageService: JhiLanguageService,
    private sharedLanguageChangeService: SharedLanguageChangeService
  ) {
    this.changeEventsubscription = this.sharedLanguageChangeService.getChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }
  ngOnDestroy(): void {
    this.changeEventsubscription.unsubscribe();
  }

  changeLanguage(): void {
    this.locale = this.languageService.getCurrentLanguage();
    this.refresh.next();
  }

  ngOnInit(): void {
    this.locale = this.languageService.getCurrentLanguage();
    this.calendarService.queryIsPublicAndActive().subscribe(events => {
      this.events = events.body!;
      this.events.forEach(event => {
        const start = new Date(event.dateStart!.toString());
        const end = new Date(event.dateEnd!.toString());
        this.calendarEvents.push({ id: event.id!, title: event.name!, start: start, end: end, color: colors.red });
      });
      this.refresh.next();
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    const id = event.id;
    this.router.navigate(['/events', id, 'view']);
  }
}
