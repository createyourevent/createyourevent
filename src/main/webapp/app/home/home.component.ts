import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { GeneralService } from '../general.service';
import * as dayjs from 'dayjs';
import { SharedLanguageChangeService } from 'app/layouts/navbar/SharedLanguageChangeService.service';
import { Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';
import { OrganisatorService } from 'app/organisator/organisator.service';
import { IShop } from 'app/entities/shop/shop.model';
import { IEvent } from 'app/entities/event/event.model';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IOrganization } from 'app/entities/organization/organization.model';
interface Lang {
  name: string;
  code: string;
}

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  authSubscription?: Subscription;
  allShops: IShop[] = [];
  allEvents: IEvent[] = [];
  allServices: ICreateYourEventService[] = [];
  allOrganizations: IOrganization[] = [];
  display = false;
  lang = 'de';
  langs: Lang[] = [];
  changeEventsubscription: Subscription = new Subscription();
  changeLangSubscription: Subscription = new Subscription();
  starEvents: any[] = [];
  loaded = false;
  activeState: boolean[] = [true, true, true, true];

  constructor(
    private accountService: AccountService,
    private generalService: GeneralService,
    private sharedLanguageChangeService: SharedLanguageChangeService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private languageService: JhiLanguageService,
    private sessionStorage: SessionStorageService,
    private organisatorService: OrganisatorService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.lang = this.getNavigatorLang();

    this.lang = this.getNavigatorLang();
    if (this.lang) {
      this.changeLanguage(this.lang);
    } else {
      this.changeLanguage('en');
    }

    this.changeLangSubscription = this.sharedLanguageChangeService.getChangeEvent().subscribe(() => {
      this.lang = this.languageService.getCurrentLanguage();
      this.changeDetectorRef.detectChanges();
    });
    this.generalService.findShopByActiveTrueAndActiveOwnerTrue().subscribe(res => {
      this.allShops = res.body!.sort(() => Math.random() - 0.5);
    });

    this.generalService.findOrganizationsByActiveAndActiveOwner().subscribe(res => {
      this.allOrganizations = res.body;
    });
    const now = dayjs();
    this.generalService.findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(now).subscribe(events => {
      this.allEvents = events.body!.sort(() => Math.random() - 0.5);

      let i = 0;
      this.allEvents.forEach(e => {
        i++;
        this.organisatorService.findReservationsByEventId(e.id!).subscribe(r => {
          e.reservations = r.body;
          if (e.reservations === null) {
            e.reservations = [];
          }

          this.generalService.getEventStarRatingByEvent(e.id!).subscribe(res => {
            const ratings = res.body!;
            let total = 0;
            ratings.forEach(el => {
              total += el.stars!;
            });
            let avg = (total / ratings.length / 10) * 5;
            if (ratings.length === 0) {
              avg = 0;
            }
            this.starEvents.push({ event: e, average: avg, total: ratings.length });
            if (i === this.allEvents.length) {
              this.loaded = true;
            }
          });
        });
      });
    });
    this.generalService.getServicesWhereActiveAndActiveOwnerTrue().subscribe(res => {
      this.allServices = res.body!.sort(() => Math.random() - 0.5);
    });

    // this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
  }

  getRandomNumber() {
    let min = 1;
    let max = 4;
    let x = Math.round(Math.random() * (max - min) + min);
    return x;
  }

  getAccountFromUserIdentity(): Account {
    return this.accountService.getAccount();
  }

  registerAccount(): void {
    this.loginService.login();
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  getNavigatorLang(): string {
    return navigator.language.split('-')[0];
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
    this.sharedLanguageChangeService.sendChangeEvent();
  }

  // Average of the stars
  getAverage(eventId: number): number {
    if (this.loaded) {
      const se = this.starEvents.find(x => x.event.id === eventId);
      return se.average;
    }
  }

  getRatingsTotal(eventId: number): number {
    if (this.loaded) {
      const se = this.starEvents.find(x => x.event.id === eventId);
      return se.total;
    }
  }

  login(): void {
    this.loginService.login();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.changeEventsubscription) {
      this.changeEventsubscription.unsubscribe();
    }
    if (this.changeLangSubscription) {
      this.changeLangSubscription.unsubscribe();
    }
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/events/' + eventId + '/view']);
  }

  register(profile: string): void {
    this.router.navigate(['/account/register/' + profile]);
  }
}
