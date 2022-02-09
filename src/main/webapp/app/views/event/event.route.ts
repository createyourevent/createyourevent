import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap, mergeMap } from 'rxjs/operators';
import { EventDetailComponent } from './event-detail.component';
import { EventUpdateComponent } from './event-update.component';
import { EventToProductRatingComponent } from './evaluate/evaluate-event-product.component';
import { EditLocationUpdateComponent } from './location-update.component';
import { AddressUpdateComponent } from './address-update.component';
import { EditProductsComponent } from './edit-products.component';
import { DashboardEventComponent } from './dashboard-event/dashboard-event.component';
import { CalculationComponent } from './dashboard-event/calculation/calculation.component';
import { CommentsComponent } from './dashboard-event/comments/comments.component';
import { GalleryComponent } from './dashboard-event/gallery/gallery.component';
import { RatingsComponent } from './dashboard-event/ratings/ratings.component';
import { WorkflowComponent } from './dashboard-event/workflow/workflow.component';
import { StarRatingsComponent } from './dashboard-event/star-ratings/star-ratings.component';
import { AddProductComponent } from './add-product.component';
import { EditServicesComponent } from './edit-services.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IEvent, Event as Party } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { MP3Component } from './dashboard-event/mp3/mp3.component';
import { InFavoritsComponent } from './dashboard-event/in-favorits/in-favorits.component';
import { BuyTicketComponent } from '../buy-ticket/buy-ticket.component';

@Injectable({ providedIn: 'root' })
export class EventResolve implements Resolve<IEvent> {
  constructor(protected service: EventService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEvent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((event: HttpResponse<Party>) => {
          if (event.body) {
            return of(event.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Party());
  }
}

export const eventRoute: Routes = [
  {
    path: ':id/view',
    component: EventDetailComponent,
    resolve: {
      event: EventResolve
    },
    data: {
      pageTitle: 'createyoureventApp.event.home.title'
    }
  },
  {
    path: ':id/edit',
    component: EventUpdateComponent,
    resolve: {
      event: EventResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':eventId/:productId/eventproductrating',
    component: EventToProductRatingComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':eventId/edit-location',
    component: EditLocationUpdateComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':locationId/edit-address',
    component: AddressUpdateComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':eventId/edit-products',
    component: EditProductsComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':eventId/edit-services',
    component: EditServicesComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':eventId/dashboard-event',
    component: DashboardEventComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService],
    children: [
      { path: 'calculation', pathMatch: 'full', component:  CalculationComponent},
      { path: 'comments',  pathMatch: 'full', component:  CommentsComponent},
      { path: 'ratings', pathMatch: 'full', component: RatingsComponent},
      { path: 'gallery', pathMatch: 'full', component: GalleryComponent},
      { path: 'mp3', pathMatch: 'full', component: MP3Component},
      { path: 'workflow', pathMatch: 'full', component: WorkflowComponent},
      { path: 'stars', pathMatch: 'full', component: StarRatingsComponent},
      { path: 'inFavorits', pathMatch: 'full', component: InFavoritsComponent},
    ]
  },
  {
    path: ':eventId/add-product',
    component: AddProductComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':eventId/buy-tickets',
    component: BuyTicketComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'createyoureventApp.event.buy-ticket.title'
    },
    canActivate: [UserRouteAccessService]
  },

];
