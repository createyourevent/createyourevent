import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";
import { SharedChatService } from "app/chat.service";
import { IEvent } from "app/entities/event/event.model";
import { IReservation } from "app/entities/reservation/reservation.model";
import { IUser } from "app/entities/user/user.model";
import { OrganisatorService } from "app/organisator/organisator.service";


@Component({
  selector: 'jhi-all-participants',
  templateUrl: './all-participants.component.html',
  styleUrls: ['all-participants.component.scss']
})
export class AllParticipantsComponent implements OnChanges {

  @Input() iEvent!: IEvent;
  reservations!: IReservation[];

  constructor(private sharedChatService: SharedChatService, private organisatorService: OrganisatorService){}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['iEvent'] !== undefined) {
      this.iEvent = changes['iEvent'].currentValue;
      this.organisatorService.findReservationsByEventId(this.iEvent.id!).subscribe(r => {
        this.reservations = r.body!;
      });
    }
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }
}
