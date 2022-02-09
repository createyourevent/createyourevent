import { GeneralService } from './../general.service';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { AuthServerProvider } from 'app/core/auth/auth-session.service';
import { Logout } from './logout.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private location: Location,
              private authServerProvider: AuthServerProvider,
              private generalService: GeneralService) {}

  login(): void {
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    location.href = `${location.origin}${this.location.prepareExternalUrl('oauth2/authorization/oidc')}`;
  }

  logout(): void {
      this.generalService.findWidthAuthorities().subscribe(u => {
        u.body.loggedIn = false;
        if(u.body.points === null) {
          u.body.points = 0;
        }
          this.generalService.updatePointsKeycloak(u.body.points, u.body.id).subscribe(() => {
            this.generalService.updateUserLoggedInAndPoints(u.body.id, u.body.loggedIn, u.body.points).subscribe(() => {
              this.authServerProvider.logout().subscribe((logout: Logout) => {
                let logoutUrl = logout.logoutUrl;
                const redirectUri = `${location.origin}${this.location.prepareExternalUrl('/')}`;

                // if Keycloak, uri has protocol/openid-connect/token
                if (logoutUrl.includes('/protocol')) {
                  logoutUrl = logoutUrl + '?redirect_uri=' + redirectUri;
                } else {
                  // Okta
                  logoutUrl = logoutUrl + '?id_token_hint=' + logout.idToken + '&post_logout_redirect_uri=' + redirectUri;
                }
                window.location.href = logoutUrl;
              });
            });
          });
        });
  }
}
