import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedChatService } from 'app/chat.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IUser } from 'app/entities/user/user.model';

@Component({
  selector: 'jhi-in-favorits',
  templateUrl: './in-favorits.component.html',
  styleUrls: ['./in-favorits.component.scss']
})
export class InFavoritsComponent implements OnInit {

  eventId: number;
  jhiEvent: IEvent;

  constructor(private route: ActivatedRoute,
              private eventService: EventService,
              private sharedChatService: SharedChatService,) { }

  ngOnInit() {
    this.route.parent!.params.subscribe(params => {
      this.eventId = params['eventId'];

      this.eventService.find(this.eventId).subscribe(ev => {
        this.jhiEvent = ev.body!;
      });
    });
  }

  openChat(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

}
