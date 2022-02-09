import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent implements OnInit {
  eventId!: number;
  jhiEvent!: IEvent;
  user!: IUser;
  sub: any;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
  ) {}

  ngOnInit(): void {
    this.route.parent!.params.subscribe(params => {
      this.eventId = params['eventId'];

      this.eventService.find(this.eventId).subscribe(ev => {
        this.jhiEvent = ev.body!;

        this.generalService.findWidthAuthorities().subscribe(user => {
          this.user = user.body!;
        });
      });
    });
  }

  previousState(): void {
    window.history.back();
  }
}
