import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

@Component({
  selector: 'jhi-dashboard-event',
  templateUrl: './dashboard-event.component.html',
  styleUrls: ['dashboard-event.component.scss']
})
export class DashboardEventComponent implements OnInit {
  navLinks: any[] = [];
  activeLinkIndex = -1;
  eventId!: number;
  jhiEvent!: IEvent;

  constructor(private router: Router,
              private translate: TranslateService,
              private route: ActivatedRoute,
              private jhiEventService: EventService) {
    this.route.params.subscribe(params => {
      this.eventId = Number(params['eventId']);
      this.navLinks = [
        {
            label: this.translate.instant('dashboard-event.calculation'),
            link: '/events/' + this.eventId + '/dashboard-event/calculation',
            index: 0
        }, {
            label: this.translate.instant('dashboard-event.comments-feedback'),
            link: '/events/' + this.eventId + '/dashboard-event/comments',
            index: 1
        }, {
            label: this.translate.instant('dashboard-event.ratings'),
            link: '/events/' + this.eventId + '/dashboard-event/ratings',
            index: 2
        }, {
            label: this.translate.instant('dashboard-event.gallery-admin'),
            link: '/events/' + this.eventId + '/dashboard-event/gallery',
            index: 3
        },
        {
          label: this.translate.instant('dashboard-event.mp3-admin'),
          link: '/events/' + this.eventId + '/dashboard-event/mp3',
          index: 4
        },
        {
            label: this.translate.instant('dashboard-event.workflow'),
            link: '/events/' + this.eventId + '/dashboard-event/workflow',
            index: 5
        },
        {
          label: this.translate.instant('dashboard-event.star-ratings-title'),
          link: '/events/' + this.eventId + '/dashboard-event/stars',
          index: 6
        },
        {
          label: this.translate.instant('dashboard-event.favorits'),
          link: '/events/' + this.eventId + '/dashboard-event/inFavorits',
          index: 7
        },
    ];
    });

}
ngOnInit(): void {
  this.router.events.subscribe(() => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
  });

  this.jhiEventService.find(this.eventId).subscribe(e => {
    this.jhiEvent = e.body!;
  });
}
}
