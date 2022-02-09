import { GeneralService } from 'app/general.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IReservation } from "app/entities/reservation/reservation.model";
import { ReservationService } from "app/entities/reservation/service/reservation.service";
import { IUser } from "app/entities/user/user.model";
import { EventService as EventUserService } from "app/views/event/event.service";
import { JhiEventManager } from "ng-jhipster";
import { OrganisatorService } from "../organisator.service";
import { GuestReservationDeleteDialogComponent } from "./guest-reservation-delete-dialog.component";


@Component({
  selector: 'jhi-guest-reservation',
  templateUrl: './guest-reservation.component.html',
  styleUrls: ['guest-reservation.scss']
})
export class GuestReservationComponent implements OnInit, OnDestroy {
  user!: IUser;
  reservations!: IReservation[];
  event!: IEvent;
  totalEntranceFee = 0;
  totalCost = 0;
  profit = 0;
  numberReservations = 0;
  maximumReservations = 0;
  previousEarnings = 0;
  minimumReservations = 0;
  tickets = 0;

  constructor(
    private eventUserService: EventUserService,
    private organisatorService: OrganisatorService,
    private route: ActivatedRoute,
    private eventService: EventService,
    protected reservationService: ReservationService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private generalService: GeneralService
  ) {}

  delete(reservation: IReservation): void {
    const modalRef = this.modalService.open(GuestReservationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reservation = reservation;
  }

  previousState(): void {
    window.history.back();
  }

  ngOnInit(): void {
    let eventId: number;
    this.route.params.subscribe(params => {
      eventId = params['eventId'];

      this.eventUserService.findEvent(eventId).subscribe(event => {
        this.event = event.body!;

        this.generalService.findWidthAuthorities().subscribe(user => {
          this.user = user.body!;

          this.organisatorService.findReservationsByEventId(this.event.id!).subscribe(res => {
            this.reservations = res.body!;
            this.reservations.forEach(r => {
              this.tickets += r.ticket.amount;
            });

            this.numberReservations = this.reservations.length;
            this.maximumReservations = this.event.placenumber!;
            this.minimumReservations = this.event.minPlacenumber;
            this.previousEarnings = this.event.price! * this.numberReservations;

            this.eventUserService.getProductsWithEventId(this.event.id!).subscribe(epo => {
              epo.body?.forEach(eventProductOrder => {
                this.totalCost += eventProductOrder.total!;
              });
              this.totalEntranceFee += this.event.placenumber! * this.event.price!;
              this.profit = this.totalEntranceFee - this.totalCost;
            });
          });
        });
      });
    });
  }

  ngOnDestroy(): void {}
}
