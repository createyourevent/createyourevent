import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'point',
        data: { pageTitle: 'createyoureventApp.point.home.title' },
        loadChildren: () => import('./point/point.module').then(m => m.PointModule),
      },
      {
        path: 'user-point-association',
        data: { pageTitle: 'createyoureventApp.userPointAssociation.home.title' },
        loadChildren: () => import('./user-point-association/user-point-association.module').then(m => m.UserPointAssociationModule),
      },
      {
        path: 'organization',
        data: { pageTitle: 'createyoureventApp.organization.home.title' },
        loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule),
      },
      {
        path: 'worksheet',
        data: { pageTitle: 'createyoureventApp.worksheet.home.title' },
        loadChildren: () => import('./worksheet/worksheet.module').then(m => m.WorksheetModule),
      },
      {
        path: 'admin-fees-price',
        data: { pageTitle: 'createyoureventApp.adminFeesPrice.home.title' },
        loadChildren: () => import('./admin-fees-price/admin-fees-price.module').then(m => m.AdminFeesPriceModule),
      },
      {
        path: 'shop',
        data: { pageTitle: 'createyoureventApp.shop.home.title' },
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
      },
      {
        path: 'restaurant',
        data: { pageTitle: 'createyoureventApp.restaurant.home.title' },
        loadChildren: () => import('./restaurant/restaurant.module').then(m => m.RestaurantModule),
      },
      {
        path: 'club',
        data: { pageTitle: 'createyoureventApp.club.home.title' },
        loadChildren: () => import('./club/club.module').then(m => m.ClubModule),
      },
      {
        path: 'create-your-event-service',
        data: { pageTitle: 'createyoureventApp.createYourEventService.home.title' },
        loadChildren: () =>
          import('./create-your-event-service/create-your-event-service.module').then(m => m.CreateYourEventServiceModule),
      },
      {
        path: 'service-offer',
        data: { pageTitle: 'createyoureventApp.serviceOffer.home.title' },
        loadChildren: () => import('./service-offer/service-offer.module').then(m => m.ServiceOfferModule),
      },
      {
        path: 'service-map',
        data: { pageTitle: 'createyoureventApp.serviceMap.home.title' },
        loadChildren: () => import('./service-map/service-map.module').then(m => m.ServiceMapModule),
      },
      {
        path: 'ride-costs',
        data: { pageTitle: 'createyoureventApp.rideCosts.home.title' },
        loadChildren: () => import('./ride-costs/ride-costs.module').then(m => m.RideCostsModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'createyoureventApp.order.home.title' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'shop-comment',
        data: { pageTitle: 'createyoureventApp.shopComment.home.title' },
        loadChildren: () => import('./shop-comment/shop-comment.module').then(m => m.ShopCommentModule),
      },
      {
        path: 'event-details',
        data: { pageTitle: 'createyoureventApp.eventDetails.home.title' },
        loadChildren: () => import('./event-details/event-details.module').then(m => m.EventDetailsModule),
      },
      {
        path: 'reservation',
        data: { pageTitle: 'createyoureventApp.reservation.home.title' },
        loadChildren: () => import('./reservation/reservation.module').then(m => m.ReservationModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'createyoureventApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'delivery-type',
        data: { pageTitle: 'createyoureventApp.deliveryType.home.title' },
        loadChildren: () => import('./delivery-type/delivery-type.module').then(m => m.DeliveryTypeModule),
      },
      {
        path: 'shop-like-dislike',
        data: { pageTitle: 'createyoureventApp.shopLikeDislike.home.title' },
        loadChildren: () => import('./shop-like-dislike/shop-like-dislike.module').then(m => m.ShopLikeDislikeModule),
      },
      {
        path: 'service-like-dislike',
        data: { pageTitle: 'createyoureventApp.serviceLikeDislike.home.title' },
        loadChildren: () => import('./service-like-dislike/service-like-dislike.module').then(m => m.ServiceLikeDislikeModule),
      },
      {
        path: 'product-like-dislike',
        data: { pageTitle: 'createyoureventApp.productLikeDislike.home.title' },
        loadChildren: () => import('./product-like-dislike/product-like-dislike.module').then(m => m.ProductLikeDislikeModule),
      },
      {
        path: 'product-comment',
        data: { pageTitle: 'createyoureventApp.productComment.home.title' },
        loadChildren: () => import('./product-comment/product-comment.module').then(m => m.ProductCommentModule),
      },
      {
        path: 'organization-like-dislike',
        data: { pageTitle: 'createyoureventApp.organizationLikeDislike.home.title' },
        loadChildren: () =>
          import('./organization-like-dislike/organization-like-dislike.module').then(m => m.OrganizationLikeDislikeModule),
      },
      {
        path: 'organization-comment',
        data: { pageTitle: 'createyoureventApp.organizationComment.home.title' },
        loadChildren: () => import('./organization-comment/organization-comment.module').then(m => m.OrganizationCommentModule),
      },
      {
        path: 'service-comment',
        data: { pageTitle: 'createyoureventApp.serviceComment.home.title' },
        loadChildren: () => import('./service-comment/service-comment.module').then(m => m.ServiceCommentModule),
      },
      {
        path: 'event-like-dislike',
        data: { pageTitle: 'createyoureventApp.eventLikeDislike.home.title' },
        loadChildren: () => import('./event-like-dislike/event-like-dislike.module').then(m => m.EventLikeDislikeModule),
      },
      {
        path: 'event-comment',
        data: { pageTitle: 'createyoureventApp.eventComment.home.title' },
        loadChildren: () => import('./event-comment/event-comment.module').then(m => m.EventCommentModule),
      },
      {
        path: 'event-product-rating',
        data: { pageTitle: 'createyoureventApp.eventProductRating.home.title' },
        loadChildren: () => import('./event-product-rating/event-product-rating.module').then(m => m.EventProductRatingModule),
      },
      {
        path: 'event-star-rating',
        data: { pageTitle: 'createyoureventApp.eventStarRating.home.title' },
        loadChildren: () => import('./event-star-rating/event-star-rating.module').then(m => m.EventStarRatingModule),
      },
      {
        path: 'shop-star-rating',
        data: { pageTitle: 'createyoureventApp.shopStarRating.home.title' },
        loadChildren: () => import('./shop-star-rating/shop-star-rating.module').then(m => m.ShopStarRatingModule),
      },
      {
        path: 'product-star-rating',
        data: { pageTitle: 'createyoureventApp.productStarRating.home.title' },
        loadChildren: () => import('./product-star-rating/product-star-rating.module').then(m => m.ProductStarRatingModule),
      },
      {
        path: 'service-star-rating',
        data: { pageTitle: 'createyoureventApp.serviceStarRating.home.title' },
        loadChildren: () => import('./service-star-rating/service-star-rating.module').then(m => m.ServiceStarRatingModule),
      },
      {
        path: 'event-product-order',
        data: { pageTitle: 'createyoureventApp.eventProductOrder.home.title' },
        loadChildren: () => import('./event-product-order/event-product-order.module').then(m => m.EventProductOrderModule),
      },
      {
        path: 'event-service-map-order',
        data: { pageTitle: 'createyoureventApp.eventServiceMapOrder.home.title' },
        loadChildren: () => import('./event-service-map-order/event-service-map-order.module').then(m => m.EventServiceMapOrderModule),
      },
      {
        path: 'cart',
        data: { pageTitle: 'createyoureventApp.cart.home.title' },
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
      },
      {
        path: 'event-product-rating-comment',
        data: { pageTitle: 'createyoureventApp.eventProductRatingComment.home.title' },
        loadChildren: () =>
          import('./event-product-rating-comment/event-product-rating-comment.module').then(m => m.EventProductRatingCommentModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'createyoureventApp.event.home.title' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'image',
        data: { pageTitle: 'createyoureventApp.image.home.title' },
        loadChildren: () => import('./image/image.module').then(m => m.ImageModule),
      },
      {
        path: 'chips',
        data: { pageTitle: 'createyoureventApp.chips.home.title' },
        loadChildren: () => import('./chips/chips.module').then(m => m.ChipsModule),
      },
      {
        path: 'chips-collection-chips',
        data: { pageTitle: 'createyoureventApp.chipsCollectionChips.home.title' },
        loadChildren: () => import('./chips-collection-chips/chips-collection-chips.module').then(m => m.ChipsCollectionChipsModule),
      },
      {
        path: 'chips-collection',
        data: { pageTitle: 'createyoureventApp.chipsCollection.home.title' },
        loadChildren: () => import('./chips-collection/chips-collection.module').then(m => m.ChipsCollectionModule),
      },
      {
        path: 'chips-admin',
        data: { pageTitle: 'createyoureventApp.chipsAdmin.home.title' },
        loadChildren: () => import('./chips-admin/chips-admin.module').then(m => m.ChipsAdminModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'createyoureventApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'address',
        data: { pageTitle: 'createyoureventApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'contact',
        data: { pageTitle: 'createyoureventApp.contact.home.title' },
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'tags',
        data: { pageTitle: 'createyoureventApp.tags.home.title' },
        loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule),
      },
      {
        path: 'gift',
        data: { pageTitle: 'createyoureventApp.gift.home.title' },
        loadChildren: () => import('./gift/gift.module').then(m => m.GiftModule),
      },
      {
        path: 'gift-shopping-cart',
        data: { pageTitle: 'createyoureventApp.giftShoppingCart.home.title' },
        loadChildren: () => import('./gift-shopping-cart/gift-shopping-cart.module').then(m => m.GiftShoppingCartModule),
      },
      {
        path: 'property',
        data: { pageTitle: 'createyoureventApp.property.home.title' },
        loadChildren: () => import('./property/property.module').then(m => m.PropertyModule),
      },
      {
        path: 'partner',
        data: { pageTitle: 'createyoureventApp.partner.home.title' },
        loadChildren: () => import('./partner/partner.module').then(m => m.PartnerModule),
      },
      {
        path: 'user-extension',
        data: { pageTitle: 'createyoureventApp.userExtension.home.title' },
        loadChildren: () => import('./user-extension/user-extension.module').then(m => m.UserExtensionModule),
      },
      {
        path: 'mp-3',
        data: { pageTitle: 'createyoureventApp.mp3.home.title' },
        loadChildren: () => import('./mp-3/mp-3.module').then(m => m.Mp3Module),
      },
      {
        path: 'hotel',
        data: { pageTitle: 'createyoureventApp.hotel.home.title' },
        loadChildren: () => import('./hotel/hotel.module').then(m => m.HotelModule),
      },
      {
        path: 'fee-transaction',
        data: { pageTitle: 'createyoureventApp.feeTransaction.home.title' },
        loadChildren: () => import('./fee-transaction/fee-transaction.module').then(m => m.FeeTransactionModule),
      },
      {
        path: 'fee-transaction-entry',
        data: { pageTitle: 'createyoureventApp.feeTransactionEntry.home.title' },
        loadChildren: () => import('./fee-transaction-entry/fee-transaction-entry.module').then(m => m.FeeTransactionEntryModule),
      },
      {
        path: 'points-exchange',
        data: { pageTitle: 'createyoureventApp.pointsExchange.home.title' },
        loadChildren: () => import('./points-exchange/points-exchange.module').then(m => m.PointsExchangeModule),
      },
      {
        path: 'bond',
        data: { pageTitle: 'createyoureventApp.bond.home.title' },
        loadChildren: () => import('./bond/bond.module').then(m => m.BondModule),
      },
      {
        path: 'fee-balance',
        data: { pageTitle: 'createyoureventApp.feeBalance.home.title' },
        loadChildren: () => import('./fee-balance/fee-balance.module').then(m => m.FeeBalanceModule),
      },
      {
        path: 'reservation-transaction-id',
        data: { pageTitle: 'createyoureventApp.reservationTransactionId.home.title' },
        loadChildren: () =>
          import('./reservation-transaction-id/reservation-transaction-id.module').then(m => m.ReservationTransactionIdModule),
      },
      {
        path: 'fee-transaction-id',
        data: { pageTitle: 'createyoureventApp.feeTransactionId.home.title' },
        loadChildren: () => import('./fee-transaction-id/fee-transaction-id.module').then(m => m.FeeTransactionIdModule),
      },
      {
        path: 'ticket',
        data: { pageTitle: 'createyoureventApp.ticket.home.title' },
        loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule),
      },
      {
        path: 'organization-reservation',
        data: { pageTitle: 'createyoureventApp.organizationReservation.home.title' },
        loadChildren: () => import('./organization-reservation/organization-reservation.module').then(m => m.OrganizationReservationModule),
      },
      {
        path: 'building',
        data: { pageTitle: 'createyoureventApp.building.home.title' },
        loadChildren: () => import('./building/building.module').then(m => m.BuildingModule),
      },
      {
        path: 'organization-star-rating',
        data: { pageTitle: 'createyoureventApp.organizationStarRating.home.title' },
        loadChildren: () => import('./organization-star-rating/organization-star-rating.module').then(m => m.OrganizationStarRatingModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
