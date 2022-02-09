import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { ChipsService } from './chips.service';
import { ChipsComponent } from './chips.component';
import { ChipsDetailComponent } from './chips-detail.component';
import { ChipsUpdateComponent } from './chips-update.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IChips, Chips } from 'app/entities/chips/chips.model';

@Injectable({ providedIn: 'root' })
export class ChipsResolve implements Resolve<IChips> {
  constructor(private service: ChipsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChips> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((chips: HttpResponse<Chips>) => {
          if (chips.body) {
            return of(chips.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Chips());
  }
}

export const chipsRoute: Routes = [
  {
    path: 'adminChips',
    component: ChipsComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'createyoureventApp.chips.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'adminChips/:id/view',
    component: ChipsDetailComponent,
    resolve: {
      chips: ChipsResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.chips.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'adminChips/new',
    component: ChipsUpdateComponent,
    resolve: {
      chips: ChipsResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.chips.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'adminChips/:id/edit',
    component: ChipsUpdateComponent,
    resolve: {
      chips: ChipsResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.chips.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
