import { ReservationTransactionId } from './../../../entities/reservation-transaction-id/reservation-transaction-id.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReservation, Reservation } from 'app/entities/reservation/reservation.model';
import { ReservationService } from 'app/entities/reservation/service/reservation.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { Ticket } from 'app/entities/ticket/ticket.model';

@Component({
  selector: 'jhi-successfull',
  templateUrl: './successfull.component.html',
  styleUrls: ['./successfull.component.scss']
})
export class SuccessfullComponent implements OnInit {

  type: string;
  id: number;
  datatransTrxId: string;
  user: IUser;
  refNo: string;
  amount: number;

  display = false;

  constructor(
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private reservationService: ReservationService,
    protected router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.display = true;
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.route.queryParams.subscribe(params => {
        this.datatransTrxId = params['datatransTrxId'];
        this.type = this.route.snapshot.params.type;
        this.id = this.route.snapshot.params.id;
        this.refNo = this.route.snapshot.params.refNo;
        this.amount = this.route.snapshot.params.amount;

        if(this.type === 'event') {
          const reservation: IReservation = new Reservation();
          this.generalService.findEventById(this.id).subscribe(e => {
            reservation.user = this.user;
            reservation.event = e.body;
            const tid: ReservationTransactionId = new ReservationTransactionId();
            tid.transactionDepositId = this.refNo;
            reservation.transactionId = tid;
            this.generalService.createReservation(reservation).subscribe(re => {
              this.reservationService.find(re.body.id).subscribe(r => {
                const res = r.body;
                const ticket = new Ticket();
                ticket.date = dayjs();
                ticket.amount = 1;
                ticket.total = e.body.price * 100;
                ticket.event = res.event;
                ticket.user = res.user;
                // ticket.refNo = this.refNo;
               // this.ticketService.create(ticket).subscribe(t => {
                res.ticket = ticket;
                  this.generalService.updateReservation(res).subscribe(() => {
                    this.router.navigate(['/events/' + this.id + '/view']);
                    this.display = false;
                  });
               // });
              });
            });
          });
        }else if(this.type === 'ticket') {
          this.reservationService.find(this.id).subscribe(r => {
            const res = r.body;
            res.billed = true;
            res.date = dayjs(new Date());
            res.transactionId.transactionId = this.refNo;
            res.ticket.refNo = this.refNo;
            this.generalService.updateReservation(res).subscribe(() => {
              this.router.navigate(['/account/tickets/' + this.id + '/payTicket']);
              this.display = false;
            });
          });
        }else if(this.type === 'cashbox') {
          this.generalService.findEventById(this.id).subscribe(e => {
            const jhie = e.body;
            jhie.billedOrganisator = true;
            this.generalService.updateEvent(jhie).subscribe(() => {
                this.router.navigate(['/organisator/cashbox/' + this.id + '/cashbox']);
                this.display = false;
            });
          });
        }else if(this.type === 'fee') {
          this.router.navigate(['/billing'], { queryParams: { txId: this.datatransTrxId, refNo: this.refNo } });
        }else if(this.type === 'buyTicket') {
          this.generalService.findWidthAuthorities().subscribe(u => {
            const user = u.body;
            this.generalService.findEventById(this.id).subscribe(e => {
              const jhie = e.body;
              const ticket = new Ticket();
              ticket.date = dayjs();
              ticket.amount = this.amount / (jhie.price * 100);
              ticket.total = this.amount;
              ticket.event = jhie;
              ticket.user = user;
              ticket.refNo = this.refNo;
              this.ticketService.create(ticket).subscribe(t => {
                const res = new Reservation();
                res.date =  dayjs();
                res.user = this.user;
                res.ticket = ticket;
                res.event = ticket.event;
                res.billed = true;
                const tid: ReservationTransactionId = new ReservationTransactionId();
                tid.transactionId = this.refNo;
                res.transactionId = tid;
                this.generalService.createReservation(res).subscribe(() => {
                   this.router.navigate(['/events/' + jhie.id + '/buy-tickets']);
                   this.display = false;
                });
              });

            });
          });
        }

      });
    });
  }

}
