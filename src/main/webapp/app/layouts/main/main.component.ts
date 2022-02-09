import { Component, OnInit, RendererFactory2, Renderer2, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd, NavigationError } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FacebookService, InitParams } from 'ngx-facebook';

import { AccountService } from 'app/core/auth/account.service';
import { GeneralService } from '../../general.service';

import { MatomoInjector } from 'ngx-matomo';
import { SharedNotificationService } from 'app/system-notification/SharedNotificationService.service';
import { Subscription } from 'rxjs';
import * as dayjs from "dayjs";
import { IEvent } from 'app/entities/event/event.model';
import { IPartner } from 'app/entities/partner/partner.model';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrls: ['main.component.scss'],
  providers: [BsModalService]
})
export class MainComponent implements OnInit, OnDestroy {
  private renderer: Renderer2;
  partners: IPartner[] = [];
  loggedIn = false;
  allEvents: IEvent[] = [];

  changeEventLoginsubscription: Subscription = new Subscription();
  changeEventLogoutsubscription: Subscription = new Subscription();

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  public modalRef: BsModalRef;

  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    rootRenderer: RendererFactory2,
    private facebookService: FacebookService,
    private matomoInjector: MatomoInjector,
    private translate: TranslateService,
    private generalService: GeneralService,
    private sharedNotificationService: SharedNotificationService,
    private idle: Idle,
    private keepalive: Keepalive,
    private modalService: BsModalService,
    private loginService: LoginService,
  ) {
        // sets an idle timeout of 5 seconds, for testing purposes.
      idle.setIdle(790);
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        idle.setTimeout(30);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onIdleEnd.subscribe(() => {
          this.idleState = 'No longer idle.'
          console.log(this.idleState);
          this.reset();
        });

        idle.onTimeout.subscribe(() => {
          this.idleState = 'Timed out!';
          this.logout();
          this.timedOut = true;
        });

        idle.onIdleStart.subscribe(() => {
            this.idleState = 'You\'ve gone idle!'
            this.childModal.show();
        });

        idle.onTimeoutWarning.subscribe((countdown) => {
          this.idleState = 'You will time out in ' + countdown + ' seconds!'
        });

        // sets the ping interval to 15 seconds
        keepalive.interval(15);

        keepalive.onPing.subscribe(() => this.lastPing = new Date());


    this.matomoInjector.init('https://matomo.createyourevent.org/', 1);
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
  }


  reset(): void {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.reset();
  }

  logout() {
    this.childModal.hide();
    this.loginService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.changeEventLoginsubscription) {
      this.changeEventLoginsubscription.unsubscribe();
    }
    if (this.changeEventLogoutsubscription) {
      this.changeEventLogoutsubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const now = dayjs();
    this.generalService.findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(now).subscribe(events => {
      this.allEvents = events.body!.sort(() => Math.random() - 0.5);
    });

    this.generalService.findAllPartnersWhereActiveTrue().subscribe(res => {
      this.partners = res.body!;
    });

    this.generalService.findWidthAuthorities().subscribe(u => {
      if (u.body) {
        this.loggedIn = true;
      }

      if (this.loggedIn) {
        this.reset();
      } else {
        this.idle.stop();
      }

    });

    this.changeEventLoginsubscription = this.sharedNotificationService.getLoginEvent().subscribe(() => {
      this.loggedIn = true;
    });

    this.changeEventLogoutsubscription = this.sharedNotificationService.getLogoutEvent().subscribe(() => {
      this.loggedIn = false;
    });

    this.initFacebookService();
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
        /*
        if (window['_paq']) {
          let currentUrl = location.href;
          window['_paq'].push(['setReferrerUrl', currentUrl]);
          currentUrl = '/' + window.location.pathname;
          window['_paq'].push(['setCustomUrl', currentUrl]);
          window['_paq'].push(['setDocumentTitle', this.translate.instant(this.getPageTitle(this.router.routerState.snapshot.root))]);

          // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
          window['_paq'].push(['deleteCustomVariables', 'page']);
          window['_paq'].push(['trackPageView']);

          // make Matomo aware of newly added content
          const content = document.getElementById('content');
          window['_paq'].push(['MediaAnalytics::scanForMedia', content]);
          window['_paq'].push(['FormAnalytics::scanForForms', content]);
          window['_paq'].push(['trackContentImpressionsWithinNode', content]);
          window['_paq'].push(['enableLinkTracking']);
        }
        */
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(['/404']);
      }
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.updateTitle();

      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });

    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : '';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    document.title = this.translate.instant(title);
    document.getElementsByTagName('title')[0].nodeValue = this.translate.instant(title);
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    this.translateService.get(pageTitle).subscribe(title => this.titleService.setTitle(title));
  }

  private initFacebookService(): void {
    const initParams: InitParams = { xfbml: true, version: 'v3.3' };
    this.facebookService.init(initParams);
  }
}
