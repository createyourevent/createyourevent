import { GeneralService } from './../../general.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from "@techiediaries/ngx-qrcode";
import { IAddress } from "app/entities/address/address.model";
import { IEvent } from "app/entities/event/event.model";
import { ILocation } from "app/entities/location/location.model";
import { IReservation } from "app/entities/reservation/reservation.model";
import { IUser } from "app/entities/user/user.model";
import jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import { EventService } from 'app/entities/event/service/event.service';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { JhiLanguageService } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'jhi-guest-reservation-detail',
  templateUrl: './guest-reservation-detail.component.html',
  styleUrls: ['guest-reservation-detail.component.scss'],
  providers: [MessageService],
})
export class GuestReservationDetailComponent implements OnInit {
  reservation!: IReservation;
  user!: IUser;
  event!: IEvent;
  location!: ILocation;
  address!: IAddress;
  countTickets = [];
  ticket: ITicket;
  mailaddress: string;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value!: string;

  constructor(private translate: TranslateService, private messageService: MessageService, protected activatedRoute: ActivatedRoute, private generalService: GeneralService, private eventService: EventService, private languageService: JhiLanguageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(reservation => {
      this.reservation = reservation.reservation;
      this.ticket = this.reservation.ticket;
      this.user = reservation.reservation.user;
      this.event = reservation.reservation.event;
      this.eventService.find(this.event.id).subscribe(e => {
        this.event = e.body;
        for(let i = 0; i < this.ticket.amount; i++) {
          this.countTickets[i] = i;
        }
        this.location = this.event.location;
        this.generalService.findAddressByLocationId(this.location.id).subscribe(a => {
          this.address = a.body;
          this.value = this.user.id + ",,," + this.event.id + ",,," + this.reservation.id + ",,," + this.user.email + ",,," + this.event.name;

        });
      });
    });
  }

  previousState(): void {
    window.history.back();
  }


  public downloadQRCode(): void {
    const fileNameToDownload = 'image_qrcode';
    const base64Img: HTMLImageElement = <HTMLImageElement>(document.getElementsByClassName('coolQRCode')[0]);
    fetch(base64Img.src)
       .then(res => res.blob())
       .then((blob) => {
          // IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob){
             window.navigator.msSaveOrOpenBlob(blob,fileNameToDownload);
          } else { // Chrome
             const url = window.URL.createObjectURL(blob);
             const link = document.createElement('a');
             link.href = url;
             link.download = fileNameToDownload;
             link.click();
          }
       })
 }


  generatePDF(): void {
    const pdf = new jspdf('p', 'mm', 'a4');
    for(let i = 0; i < this.ticket.amount; i++){
      const data = document.getElementById('reservationPDF-' + i);
      html2canvas(data!).then((canvas: any) => {
        const imgWidth = 150;
        const imgHeight = 287;
        const contentDataURL = canvas.toDataURL('image/png')
        const position = 10;
        pdf.addImage(contentDataURL, 'PNG', 29, position, imgWidth, imgHeight);
        if(i < this.ticket.amount - 1) {
          pdf.addPage('a4', 'p');
          pdf.setPage(i + 2);
        } else {
          pdf.save('ticket_print_at_home.pdf');
        }
      });
    }
  }

  handleClick(e: any, reservationId: number) {
    //const input = <HTMLInputElement> document.getElementById('mail-' + reservationId);
    const mail = this.mailaddress;
    //input.value = "";
    const pdf = new jspdf('p', 'mm', 'a4');
    for(let i = 0; i < this.ticket.amount; i++){
      const data = document.getElementById('reservationPDF-' + i);
      html2canvas(data!).then((canvas: any) => {
        const imgWidth = 150;
        const imgHeight = 287;
        const contentDataURL = canvas.toDataURL('image/png')
        const position = 10;
        pdf.addImage(contentDataURL, 'PNG', 29, position, imgWidth, imgHeight);
        const file = pdf.output('blob');
        const fd = new FormData();     // To carry on your data
        fd.append('file',file);
        this.generalService.uploadPdf(fd, reservationId, mail, this.languageService.getCurrentLanguage()).subscribe(
          (data) => this.onSuccess(data),
          (error) => this.handleError(error)
        );
      });
    }
  }

  onSuccess(data:any) {
    this.messageService.add({severity:'success', summary: this.translate.instant('guest-reservation.success-mail'), detail: this.translate.instant('guest-reservation.success-mail-info')});
    this.mailaddress = "";
  }

  handleError(error) {
    this.messageService.add({severity:'error', summary: this.translate.instant('guest-reservation.error-mail'), detail: this.translate.instant('guest-reservation.error-mail-info')});
  }
}
