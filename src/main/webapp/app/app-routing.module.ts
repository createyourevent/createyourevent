import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'organisator',
          data: {
            authorities: [Authority.ORGANISATOR],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./organisator/organisator.module').then(m => m.OrganisatorModule),
        },
        {
          path: 'locations',
          loadChildren: () => import('./locations/locations.module').then(m => m.LocationsModule),
        },
        {
          path: 'supplier',
          loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
        },
        {
          path: 'service',
          loadChildren: () => import('./service/service.module').then(m => m.ServiceModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'about-us',
          loadChildren: () => import('./about-us/about-us.module').then(m => m.AboutUsModule),
        },
        {
          path: 'payitforward',
          loadChildren: () => import('./pay-it-forward/pay-it-forward.module').then(m => m.PayItForwardModule),
        },
        {
          path: 'instructions',
          loadChildren: () => import('./instructions/instructions.module').then(m => m.InstructionsModule),
        },
        {
          path: 'businessplan',
          loadChildren: () => import('./business-plan/business-plan.module').then(m => m.BusinessPlanModule),
        },
        {
          path: 'impressum',
          loadChildren: () => import('./impressum/impressum.module').then(m => m.ImpressumModule),
        },
        {
          path: 'calendar',
          loadChildren: () => import('./calendar/calendar.module').then(m => m.EventCalendarModule),
        },
        {
          path: 'map',
          loadChildren: () => import('./map/map.module').then(m => m.MapModule),
        },
        {
          path: 'contactForm',
          loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
        },
        {
          path: 'points-list',
          loadChildren: () => import('./points/points.module').then(m => m.PointsModule),
        },
        {
          path: 'exchange',
          loadChildren: () => import('./points/exchange/exchange.module').then(m => m.ExchangeModule),
        },
        {
          path: 'my-gifts',
          loadChildren: () => import('./points/my-gifts/my-gifts.module').then(m => m.MyGiftsModule),
        },
        {
          path: 'wheelOfFortune',
          loadChildren: () => import('./points/wheelOfFortune/wheelOfFortune.module').then(m => m.WheelOfFortuneModule),
        },
        {
          path: 'stream',
          loadChildren: () => import('./stream/stream.module').then(m => m.StreamModule),
        },
        {
          path: 'search-events',
          loadChildren: () => import('./search-data-views/event-data-view/event-data-view.module').then(m => m.EventDataViewModule),
        },
        {
          path: 'search-products',
          loadChildren: () => import('./search-data-views/product-data-view/product-data-view.module').then(m => m.ProductDataViewModule),
        },
        {
          path: 'search-shops',
          loadChildren: () => import('./search-data-views/shop-data-view/shop-data-view.module').then(m => m.ShopDataViewModule),
        },
        {
          path: 'search-organizations',
          loadChildren: () =>
            import('./search-data-views/organization-data-view/organization-data-view.module').then(m => m.OrganizationDataViewModule),
        },
        {
          path: 'search-services',
          loadChildren: () => import('./search-data-views/service-data-view/service-data-view.module').then(m => m.ServiceDataViewModule),
        },
        {
          path: 'createyourevent-tv',
          loadChildren: () => import('./createyourevent-tv/createyourevent-tv.module').then(m => m.CreateyoureventTvModule),
        },
        {
          path: 'chipsOverview',
          loadChildren: () => import('./views/games/find-the-chips/chips-overview/chips-overview.module').then(m => m.ChipsOverviewModule),
        },
        {
          path: 'coupons',
          loadChildren: () => import('./coupons/coupons.module').then(m => m.CouponsModule),
        },
        /*
        {
          path: 'adminChips',
          loadChildren: () => import('./views/games/find-the-chips/admin-chips/chips.module').then(m => m.CreateyoureventCYEChipsModule)
        },
        */
        {
          path: 'turn-of-wheel-admin',
          loadChildren: () => import('./views/games/luckySpin/adminLuckySpin/adminLuckySpin.module').then(m => m.AdminLuckySpinModule),
        },
        {
          path: 'tetris',
          loadChildren: () => import('./views/games/tetris/tetris.module').then(m => m.TetrisModule),
        },
        {
          path: 'account/tickets',
          loadChildren: () => import('./account/tickets/tickets.module').then(m => m.TicketsModule),
        },
        {
          path: 'schaffhausen',
          loadChildren: () => import('./schaffhausen/schaffhausenHome/schaffhausenHome.module').then(m => m.SchaffhausenHomeModule),
        },
        {
          path: 'register-partner',
          loadChildren: () => import('./partner/register/register.module').then(m => m.RegisterModule),
        },
        {
          path: 'partners',
          loadChildren: () => import('./partner/partner.module').then(m => m.PartnerModule),
        },
        {
          path: 'shops',
          loadChildren: () => import('./views/shop/shop.module').then(m => m.CreateyoureventShopsModule),
        },
        {
          path: 'products',
          loadChildren: () => import('./views/product/product.module').then(m => m.CreateyoureventProductsModule),
        },
        {
          path: 'events',
          loadChildren: () => import('./views/event/event.module').then(m => m.CYEEventModule),
        },
        {
          path: 'services',
          loadChildren: () => import('./views/service/service.module').then(m => m.CreateyoureventServicessModule),
        },
        {
          path: 'redeem-point-bonds',
          loadChildren: () => import('./points/redeem-point-bonds/redeem-point-bonds.module').then(m => m.RedeemPointBondsModule),
        },
        {
          path: 'mobile-app',
          loadChildren: () => import('./mobile-app/mobile-app.module').then(m => m.MobileAppModule),
        },
        {
          path: 'agb',
          loadChildren: () => import('./agb/agb.module').then(m => m.AgbModule),
        },
        ...LAYOUT_ROUTES,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
