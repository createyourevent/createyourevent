import { Socket } from 'ngx-socket-io';
import { GeneralService } from 'app/general.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { AccountService } from 'app/core/auth/account.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { SharedLanguageChangeService } from './SharedLanguageChangeService.service';
import { CookieService } from 'ngx-cookie-service';
import { OnDestroy } from '@angular/core';
import { ChipsAdminService } from 'app/entities/chips-admin/service/chips-admin.service';
import { LANGUAGES } from 'app/config/language.constants';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  swaggerEnabled?: boolean;
  version: string;
  chipsGameOn = false;

  constructor(
    private languageService: JhiLanguageService,
    private sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private sharedLanguageChangeService: SharedLanguageChangeService,
    private cookieService: CookieService,
    private chipsAdminService: ChipsAdminService,
    private loginService: LoginService,
    private generalService: GeneralService,
    private socket: Socket
  ) {
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';
  }

  ngOnInit(): void {

    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });

    this.chipsAdminService.find(1).subscribe((active: any) => {
      const activeGame = active.body.gameActive;
      if(activeGame) {
        this.chipsGameOn = true;
      }
    });
  }

  ngOnDestroy(): void {
  }


  changeLanguage(languageKey: string): void {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
    this.sharedLanguageChangeService.sendChangeEvent();
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginService.login();

  }

  logout(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.socket.emit('end', u.body.id);
      this.collapseNavbar();
      this.loginService.logout();
      this.cookieService.deleteAll('/');
      this.router.navigate(['']);
    });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getImageUrl(): string {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : '';
  }
}
