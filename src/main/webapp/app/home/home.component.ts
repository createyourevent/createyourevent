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
import { SlotListClockService } from 'app/entities/slot-list-clock/service/slot-list-clock.service';
import { SlotListCherryService } from 'app/entities/slot-list-cherry/service/slot-list-cherry.service';
import { SlotListOrangeService } from 'app/entities/slot-list-orange/service/slot-list-orange.service';
import { SlotListPlumService } from 'app/entities/slot-list-plum/service/slot-list-plum.service';
import { CouponService } from 'app/entities/coupon/service/coupon.service';
import { ICoupon } from 'app/entities/coupon/coupon.model';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
interface Lang {
  name: string;
  code: string;
}

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
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
  clockCoupon: ICoupon;
  cherryCoupon: ICoupon;
  orangeCoupon: ICoupon;
  plumCoupon: ICoupon;

  constructor(
    private accountService: AccountService,
    private generalService: GeneralService,
    private sharedLanguageChangeService: SharedLanguageChangeService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private languageService: JhiLanguageService,
    private sessionStorage: SessionStorageService,
    private organisatorService: OrganisatorService,
    private loginService: LoginService,
    private slotListClockService: SlotListClockService,
    private slotListOrangeService: SlotListOrangeService,
    private slotListCherryService: SlotListCherryService,
    private slotListPlumService: SlotListPlumService,
    private couponService: CouponService,
    private messageService: MessageService,
    private translate: TranslateService
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

    this.couponService.query().subscribe(res => {
      const coupons = res.body;

      this.slotListClockService.query().subscribe(res => {
        const clocksString = res.body;
        const clocks = clocksString[0].coupons.split(',').slice(0, -1);
        this.clockCoupon = coupons.find(c => Number(clocks[0]) === c.id);
      });

      this.slotListCherryService.query().subscribe(res => {
        const cherriesString = res.body;
        const cherries = cherriesString[0].coupons.split(',').slice(0, -1);
        this.cherryCoupon = coupons.find(c => Number(cherries[0]) === c.id);
      });

      this.slotListOrangeService.query().subscribe(res => {
        const orangesString = res.body;
        const oranges = orangesString[0].coupons.split(',').slice(0, -1);
        this.orangeCoupon = coupons.find(c => Number(oranges[0]) === c.id);
      });

      this.slotListPlumService.query().subscribe(res => {
        const plumsString = res.body;
        const plums = plumsString[0].coupons.split(',').slice(0, -1);
        this.plumCoupon = coupons.find(c => Number(plums[0]) === c.id);
      });
    });
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

  clockWin(e: any) {
    this.slotListClockService.query().subscribe(res => {
      const slc = res.body;
      const arr = slc[0].coupons.split(',');
      const couponId = Number(arr[0]);
      arr.shift();
      let newArr = arr.join();
      this.couponService.find(couponId).subscribe(c => {
        const coupon = c.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          const user = u.body;
          coupon.user = user;
          this.couponService.update(coupon).subscribe(cu => {
            slc[0].coupons = newArr;
            this.slotListClockService.update(slc[0]).subscribe(res => {
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('home.won'),
                detail: this.translate.instant('home.won.info.clock'),
              });
            });
          });
        });
      });
    });
  }

  orangeWin(e: any) {
    this.slotListOrangeService.query().subscribe(res => {
      const slc = res.body;
      const arr = slc[0].coupons.split(',');
      const couponId = Number(arr[0]);
      arr.shift();
      let newArr = arr.join();
      this.couponService.find(couponId).subscribe(c => {
        const coupon = c.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          const user = u.body;
          coupon.user = user;
          this.couponService.update(coupon).subscribe(cu => {
            slc[0].coupons = newArr;
            this.slotListOrangeService.update(slc[0]).subscribe(res => {
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('home.won'),
                detail: this.translate.instant('home.won.info.orange'),
              });
            });
          });
        });
      });
    });
  }

  cherryWin(e: any) {
    this.slotListCherryService.query().subscribe(res => {
      const slc = res.body;
      const arr = slc[0].coupons.split(',');
      const couponId = Number(arr[0]);
      arr.shift();
      let newArr = arr.join();
      this.couponService.find(couponId).subscribe(c => {
        const coupon = c.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          const user = u.body;
          coupon.user = user;
          this.couponService.update(coupon).subscribe(cu => {
            slc[0].coupons = newArr;
            this.slotListCherryService.update(slc[0]).subscribe(res => {
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('home.won'),
                detail: this.translate.instant('home.won.info.cherry'),
              });
            });
          });
        });
      });
    });
  }

  plumWin(e: any) {
    this.slotListPlumService.query().subscribe(res => {
      const slc = res.body;
      const arr = slc[0].coupons.split(',');
      const couponId = Number(arr[0]);
      arr.shift();
      let newArr = arr.join();
      this.couponService.find(couponId).subscribe(c => {
        const coupon = c.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          const user = u.body;
          coupon.user = user;
          this.couponService.update(coupon).subscribe(cu => {
            slc[0].coupons = newArr;
            this.slotListPlumService.update(slc[0]).subscribe(res => {
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('home.won'),
                detail: this.translate.instant('home.won.info.plum'),
              });
            });
          });
        });
      });
    });
  }
}
