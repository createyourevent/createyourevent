import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IUser } from "app/entities/user/user.model";
import { IWorksheet } from "app/entities/worksheet/worksheet.model";
import { GeneralService } from "app/general.service";
import { EventService as EventUserService } from "app/views/event/event.service";


@Component({
  selector: 'jhi-offer-organisator',
  templateUrl: './offer-organisator.component.html',
  styleUrls: ['./offer-organisator.component.scss']
})
export class OfferOrganisatorComponent implements OnInit {
  jhiEvent!: IEvent;
  worksheets!: IWorksheet[];
  user!: IUser;

  constructor(
    private generalService: GeneralService,
    private eventService: EventService,
    private eventUserService: EventUserService,
    private route: ActivatedRoute
  ) {
    let eventId: number;
    this.route.params.subscribe(params => {
      eventId = params['eventId'];

      this.eventService.find(Number(eventId)).subscribe(ev => {
        this.jhiEvent = ev.body!;

        this.generalService.findWidthAuthorities().subscribe(user => {
          this.user = user.body!;
        });

        this.generalService.findWorksheetsByEventId(this.jhiEvent.id!).subscribe(values => {
          this.worksheets = values.body!;
        });
      });
    });
  }

  ngOnInit(): void {}
}
