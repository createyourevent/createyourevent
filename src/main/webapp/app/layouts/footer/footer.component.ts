import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { IEvent } from 'app/entities/event/event.model';
import { IPartner } from 'app/entities/partner/partner.model';
import { GeneralService } from 'app/general.service';
import * as dayjs from "dayjs";

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnInit {
  allEvents: IEvent[] = [];
  partners: IPartner[] = [];
  isNavbarCollapsed = true;

  constructor(private generalService: GeneralService, private accountService: AccountService,) {}
  ngOnInit(): void {
    const now = dayjs();
    this.generalService.findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(now).subscribe(events => {
      this.allEvents = events.body!.sort(() => Math.random() - 0.5);
    });

    this.generalService.findAllPartnersWhereActiveTrue().subscribe(res => {
      this.partners = res.body!;
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }



  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
