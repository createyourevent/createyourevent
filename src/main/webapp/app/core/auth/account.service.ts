import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account } from 'app/core/auth/account.model';
import { JhiLanguageService } from 'ng-jhipster';
import { SharedNotificationService } from '../../system-notification/SharedNotificationService.service';
import { PointsDataService } from 'app/points/points-display/points-display.service';
import { GeneralService } from 'app/general.service';
import { Socket } from 'ngx-socket-io';
import * as dayjs from 'dayjs';
import { ChipsCollection } from 'app/entities/chips-collection/chips-collection.model';
import { ChipsCollectionService } from 'app/entities/chips-collection/service/chips-collection.service';
import { UserPointAssociationService } from 'app/entities/user-point-association/service/user-point-association.service';
import { UserPointAssociation } from 'app/entities/user-point-association/user-point-association.model';
import { SharedChatService } from 'app/chat.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account | null>;

  constructor(
    private translateService: TranslateService,
    private sessionStorage: SessionStorageService,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService,
    private languageService: JhiLanguageService,
    private sharedNotificationService: SharedNotificationService,
    private pointsDataService: PointsDataService,
    private generalService: GeneralService,
    private socket: Socket,
    private userPointAssociationService: UserPointAssociationService,
    private chipsCollectionService: ChipsCollectionService,
    private sharedChatService: SharedChatService
  ) {}

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }

    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => of(null)),
        tap((account: Account | null) => {
          this.authenticate(account);

          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          if (account && account.langKey) {
            this.sharedChatService.onLoginComplete();
            const langKey = this.sessionStorage.retrieve('locale') || account.langKey;
            this.languageService.changeLanguage(langKey);

            this.generalService.findWidthAuthorities().subscribe(u => {
              if (u.body.agb === null || u.body.agb === undefined || u.body.agb === false) {
                this.router.navigate(['/agb']);
                return;
              }

              if (u.body.address === null || u.body.phone === null || u.body.iban === null) {
                this.router.navigate(['/settings']);
                return;
              }
              this.generalService.getPointsFromUser(u.body.id).subscribe(p => {
                const pointsKc = p.body;
                u.body.points = pointsKc;
                this.pointsDataService.changePoint(u.body.points);
                if (u.body.points === null) {
                  u.body.points = 0;
                  this.generalService.updateUserLoggedInAndPoints(u.body.id, u.body.loggedIn, u.body.points).subscribe();
                }

                u.body.loggedIn = true;
                this.generalService.updateUserLoggedInAndPoints(u.body.id, u.body.loggedIn, u.body.points).subscribe();
              });

              this.generalService.findChipsCollectionByUserId(u.body.id).subscribe(ucc => {
                if (ucc.body === null || ucc.body === undefined) {
                  const chipsCollection = new ChipsCollection();
                  chipsCollection.user = u.body;
                  this.chipsCollectionService.create(chipsCollection).subscribe();
                }
              });

              this.socket.emit('join', account.firstName + ' ' + account.lastName, u.body.id);

              this.pointsDataService.changePoint(u.body.points);
              if (!u.body.loggedIn) {
                this.generalService.findPointsByKey('login').subscribe(p => {
                  const points = p.body;
                  this.generalService.findUserPointAssociationByUsersIdAndPointkey(u.body.id, points.key).subscribe(s => {
                    const upa = s.body;
                    const day = dayjs();
                    let i = 0;
                    upa.forEach(element => {
                      if (day.isSame(element.date, 'day')) {
                        i++;
                      }
                    });
                    if (i <= points.countPerDay) {
                      const iupa = new UserPointAssociation();
                      iupa.users = u.body;
                      iupa.points = points;
                      iupa.date = dayjs();
                      this.userPointAssociationService.create(iupa).subscribe();
                      u.body.points += points.points;
                      u.body.loggedIn = true;
                      this.generalService.findWidthAuthorities().subscribe(us => {
                        const user = us.body;
                        this.generalService.updateUserLoggedInAndPoints(u.body.id, u.body.loggedIn, u.body.points).subscribe(t => {
                          this.pointsDataService.changePoint(u.body.points);
                        });
                      });
                    }
                  });
                });
              }
            });

            this.sharedNotificationService.sendLoginEvent();
          }

          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          if (account?.langKey) {
            const langKey = this.sessionStorage.retrieve('locale') ?? account.langKey;
            this.translateService.use(langKey);
          }

          if (account) {
            this.navigateToStoredUrl();
          }
        }),
        shareReplay()
      );
    }
    return this.accountCache$;
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.userIdentity?.imageUrl ?? '';
  }

  getAccount(): Account {
    return this.userIdentity;
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account'));
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
