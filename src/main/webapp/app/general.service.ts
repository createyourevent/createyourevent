import { IOrganization } from './entities/organization/organization.model';
import { ITicket } from './entities/ticket/ticket.model';
import { IBond } from './entities/bond/bond.model';
import { IMp3 } from './entities/mp-3/mp-3.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import * as dayjs from 'dayjs';
import { map } from 'rxjs/operators';
import { createRequestOption } from './core/request/request-util';
import { IChipsCollectionChips } from './entities/chips-collection-chips/chips-collection-chips.model';
import { IChipsCollection } from './entities/chips-collection/chips-collection.model';
import { ICreateYourEventService } from './entities/create-your-event-service/create-your-event-service.model';
import { IDeliveryType } from './entities/delivery-type/delivery-type.model';
import { IEventComment } from './entities/event-comment/event-comment.model';
import { IEventLikeDislike } from './entities/event-like-dislike/event-like-dislike.model';
import { IEventProductOrder } from './entities/event-product-order/event-product-order.model';
import { IEventProductRating } from './entities/event-product-rating/event-product-rating.model';
import { IEventServiceMapOrder } from './entities/event-service-map-order/event-service-map-order.model';
import { IEventStarRating } from './entities/event-star-rating/event-star-rating.model';
import { IEvent } from './entities/event/event.model';
import { IGiftShoppingCart } from './entities/gift-shopping-cart/gift-shopping-cart.model';
import { IGift } from './entities/gift/gift.model';
import { IImage } from './entities/image/image.model';
import { IPartner } from './entities/partner/partner.model';
import { IPoint } from './entities/point/point.model';
import { IProductComment } from './entities/product-comment/product-comment.model';
import { IProductLikeDislike } from './entities/product-like-dislike/product-like-dislike.model';
import { IProductStarRating } from './entities/product-star-rating/product-star-rating.model';
import { IProduct } from './entities/product/product.model';
import { IProperty } from './entities/property/property.model';
import { IReservation } from './entities/reservation/reservation.model';
import { IServiceComment } from './entities/service-comment/service-comment.model';
import { IServiceLikeDislike } from './entities/service-like-dislike/service-like-dislike.model';
import { IServiceMap } from './entities/service-map/service-map.model';
import { IServiceOffer } from './entities/service-offer/service-offer.model';
import { IServiceStarRating } from './entities/service-star-rating/service-star-rating.model';
import { IShopComment } from './entities/shop-comment/shop-comment.model';
import { IShopLikeDislike } from './entities/shop-like-dislike/shop-like-dislike.model';
import { IShopStarRating } from './entities/shop-star-rating/shop-star-rating.model';
import { IShop } from './entities/shop/shop.model';
import { ITags } from './entities/tags/tags.model';
import { IUserPointAssociation } from './entities/user-point-association/user-point-association.model';
import { IUser } from './entities/user/user.model';
import { IWorksheet } from './entities/worksheet/worksheet.model';
import { IChatMessage } from './chat/chat-message.model';
import { IAddress } from './entities/address/address.model';
import { IRestaurant } from './entities/restaurant/restaurant.model';
import { IHotel } from './entities/hotel/hotel.model';
import { IClub } from './entities/club/club.model';
import { IOrganizationLikeDislike } from './entities/organization-like-dislike/organization-like-dislike.model';
import { IOrganizationStarRating } from './entities/organization-star-rating/organization-star-rating.model';
import { IOrganizationComment } from './entities/organization-comment/organization-comment.model';
import { IOrganizationReservation } from './entities/organization-reservation/organization-reservation.model';
import { ICoupon } from './entities/coupon/coupon.model';
import { IBuilding } from './entities/building/building.model';

type EntityResponseType = HttpResponse<IUser>;
type EntityResponseType_Event = HttpResponse<IEvent>;
type EntityResponseType_Bond = HttpResponse<IBond>;
type EntityResponseType_EPO = HttpResponse<IEventProductOrder>;
type EntityResponseType_ESMO = HttpResponse<IEventServiceMapOrder>;

@Injectable({ providedIn: 'root' })
export class GeneralService {
  public resourceUrl = SERVER_API_URL + 'api/users';
  public resourceUrl_keycloak = SERVER_API_URL + 'api/keycloak';
  public resourceUrlAddress = SERVER_API_URL + 'api/addresses';
  public resourceUrl_cye = SERVER_API_URL + 'api/users_createyourevent';
  public resourceUrl_worksheet = SERVER_API_URL + 'api/worksheets';
  public resourceUrl_eventproductrating = SERVER_API_URL + 'api/event-product-ratings';
  public resourceUrl_image = SERVER_API_URL + 'api/images';
  public resourceUrl_shop_like_dislikes = SERVER_API_URL + 'api/shop-like-dislikes';
  public resourceUrl_shop_comments = SERVER_API_URL + 'api/shop-comments';
  public resourceUrl_product_comments = SERVER_API_URL + 'api/product-comments';
  public resourceUrl_product_like_dislikes = SERVER_API_URL + 'api/product-like-dislikes';
  public resourceUrl_event_comments = SERVER_API_URL + 'api/event-comments';
  public resourceUrl_event_like_dislikes = SERVER_API_URL + 'api/event-like-dislikes';
  public resourceUrl_service_like_dislikes = SERVER_API_URL + 'api/service-like-dislikes';
  public resourceUrl_event = SERVER_API_URL + 'api/events';
  public resourceUrl_shop = SERVER_API_URL + 'api/shops';
  public resourceUrl_eventProductOrder = SERVER_API_URL + 'api/event-product-orders';
  public resourceUrl_product = SERVER_API_URL + 'api/products';
  public resourceUrl_chat = SERVER_API_URL + 'api/chatMessages';
  public resourceUrl_service = SERVER_API_URL + 'api/create-your-event-services';
  public resourceUrl_servicemaps = SERVER_API_URL + 'api/service-maps';
  public resourceUrl_serviceoffers = SERVER_API_URL + 'api/service-offers';
  public resourceUrl_service_comments = SERVER_API_URL + 'api/service-comments';
  public resourceUrl_event_service_map_orders = SERVER_API_URL + 'api/event-service-map-orders';
  public resourceUrl_event_star_ratings = SERVER_API_URL + 'api/event-star-ratings';
  public resourceUrl_reservation = SERVER_API_URL + 'api/reservations';
  public resourceUrl_tags = SERVER_API_URL + 'api/tags';
  public resourceUrl_points = SERVER_API_URL + 'api/points';
  public resourceUrl_pointsUsers = SERVER_API_URL + 'api/user-point-associations';
  public resourceUrl_shop_star_rating = SERVER_API_URL + 'api/shop-star-ratings';
  public resourceUrl_gifts = SERVER_API_URL + 'api/gifts';
  public resourceUrl_properties = SERVER_API_URL + 'api/properties';
  public resourceUrl_product_star_rating = SERVER_API_URL + 'api/product-star-ratings';
  public resourceUrl_service_star_rating = SERVER_API_URL + 'api/service-star-ratings';
  public resourceUrl_chips_collections = SERVER_API_URL + 'api/chips-collections';
  public resourceUrl_chips_admins = SERVER_API_URL + 'api/chips-admins';
  public resourceUrl_chips = SERVER_API_URL + 'api/chips';
  public resourceUrl_chips_collection_chips = SERVER_API_URL + 'api/chips-collection-chips';
  public resourceUrl_gift_shopping_carts = SERVER_API_URL + 'api/gift-shopping-carts';
  public resourceUrl_partners = SERVER_API_URL + 'api/partners';
  public resourceUrl_delivery_types = SERVER_API_URL + 'api/delivery-types';
  public resourceUrl_mp3 = SERVER_API_URL + 'api/mp-3-s';
  public resourceUrl_music = SERVER_API_URL + 'api/music';
  public resourceUrl_music_del = SERVER_API_URL + 'api/music_del';
  public resourceUrl_bond = SERVER_API_URL + 'api/bonds';
  public resourceUrl_datatrans = SERVER_API_URL + 'api/datatrans';
  public resourceUrl_tickets = SERVER_API_URL + 'api/tickets';
  public resourceUrl_send_ticket = SERVER_API_URL + 'api/send-ticket';
  public resourceUrl_restaurants = SERVER_API_URL + 'api/restaurants';
  public resourceUrl_hotels = SERVER_API_URL + 'api/hotels';
  public resourceUrl_clubs = SERVER_API_URL + 'api/clubs';
  public resourceUrl_buildings = SERVER_API_URL + 'api/buildings';
  public resourceUrl_organizations = SERVER_API_URL + 'api/organizations';
  public resourceUrl_organization_star_ratings = SERVER_API_URL + 'api/organization-star-ratings';
  public resourceUrl_organization_comments = SERVER_API_URL + 'api/organization-comments';
  public resourceUrl_organization_like_dislikes = SERVER_API_URL + 'api/organization-like-dislikes';
  public resourceUrl_organization_reservations = SERVER_API_URL + 'api/organization-reservations';
  public resourceUrl_slot_list_plum = SERVER_API_URL + 'api/slot-list-plums';
  public resourceUrl_slot_list_clock = SERVER_API_URL + 'api/slot-list-clocks';
  public resourceUrl_slot_list_orange = SERVER_API_URL + 'api/slot-list-oranges';
  public resourceUrl_slot_list_cherry = SERVER_API_URL + 'api/slot-list-cherries';
  public resourceUrl_coupons = SERVER_API_URL + 'api/coupons';

  constructor(protected http: HttpClient) {}

  updatePointsKeycloak(points: number, userId: string): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl_keycloak}/${userId}/${points}`, { observe: 'response' });
  }

  getPointsFromUser(userId: string): Observable<HttpResponse<number>> {
    return this.http.get<number>(`${this.resourceUrl_keycloak}/${userId}`, { observe: 'response' });
  }

  updateBond(bond: IBond): Observable<EntityResponseType_Bond> {
    const copy = this.convertDateFromClient_Bond(bond);
    return this.http
      .put<IBond>(`${this.resourceUrl_bond}/${bond.id}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType_Bond) => this.convertDateFromServer_Bond(res)));
  }

  protected convertDateFromClient_Bond(bond: IBond): IBond {
    return Object.assign({}, bond, {
      creationDate: dayjs(bond.creationDate)?.isValid() ? dayjs(bond.creationDate).toJSON() : undefined,
      redemptionDate: dayjs(bond.redemptionDate)?.isValid() ? dayjs(bond.redemptionDate).toJSON() : undefined,
    });
  }

  protected convertDateFromServer_Bond(res: EntityResponseType_Bond): EntityResponseType_Bond {
    if (res.body) {
      res.body.creationDate = res.body.creationDate ? dayjs(res.body.creationDate) : undefined;
      res.body.redemptionDate = res.body.redemptionDate ? dayjs(res.body.redemptionDate) : undefined;
    }
    return res;
  }

  updateEvent(event: IEvent): Observable<EntityResponseType_Event> {
    const copy = this.convertDateFromClient(event);
    return this.http
      .put<IEvent>(`${this.resourceUrl_event}/${event.id}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType_Event) => this.convertDateFromServer(res)));
  }

  updateOrganizationReservation(organizationReservation: IOrganizationReservation): Observable<HttpResponse<IOrganizationReservation>> {
    const copy = this.convertOrganizationReservationDateFromClient(organizationReservation);
    return this.http
      .put<IOrganizationReservation>(`${this.resourceUrl_organization_reservations}/${organizationReservation.id}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<IOrganizationReservation>) => this.convertOrganizationReservationDateFromServer(res)));
  }

  protected convertOrganizationReservationDateFromClient(organizationReservation: IOrganizationReservation): IOrganizationReservation {
    return Object.assign({}, organizationReservation, {
      date: dayjs(organizationReservation.date)?.isValid() ? dayjs(organizationReservation.date).toJSON() : undefined,
      dateFrom: dayjs(organizationReservation.dateFrom)?.isValid() ? dayjs(organizationReservation.dateFrom).toJSON() : undefined,
      dateUntil: dayjs(organizationReservation.dateUntil)?.isValid() ? dayjs(organizationReservation.dateUntil).toJSON() : undefined,
    });
  }

  protected convertOrganizationReservationDateFromServer(
    res: HttpResponse<IOrganizationReservation>
  ): HttpResponse<IOrganizationReservation> {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
      res.body.dateFrom = res.body.dateFrom ? dayjs(res.body.dateFrom) : undefined;
      res.body.dateUntil = res.body.dateUntil ? dayjs(res.body.dateUntil) : undefined;
    }
    return res;
  }

  findEventWithId(id: number): Observable<HttpResponse<IEvent>> {
    return this.http.get<IEvent>(`${this.resourceUrl_event}/findById/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(event: IEvent): IEvent {
    const copy: IEvent = Object.assign({}, event, {
      dateStart: event.dateStart && dayjs(event.dateStart).isValid() ? dayjs(event.dateStart).toJSON() : undefined,
      dateEnd: event.dateEnd && dayjs(event.dateEnd).isValid() ? dayjs(event.dateEnd).toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType_Event): EntityResponseType_Event {
    if (res.body) {
      res.body.dateStart = res.body.dateStart ? dayjs(res.body.dateStart) : undefined;
      res.body.dateEnd = res.body.dateEnd ? dayjs(res.body.dateEnd) : undefined;
    }
    return res;
  }

  updateEventProductOrder(eventProductOrder: IEventProductOrder): Observable<EntityResponseType_EPO> {
    const copy = this.convertDateFromClientEPO(eventProductOrder);
    return this.http
      .put<IEventProductOrder>(`${this.resourceUrl_eventProductOrder}/${eventProductOrder.id}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType_EPO) => this.convertDateFromServerEPO(res)));
  }

  protected convertDateFromClientEPO(eventProductOrder: IEventProductOrder): IEventProductOrder {
    return Object.assign({}, eventProductOrder, {
      date: dayjs(eventProductOrder.date).isValid() ? dayjs(eventProductOrder.date).toJSON() : undefined,
      dateFrom: dayjs(eventProductOrder.dateFrom).isValid() ? dayjs(eventProductOrder.dateFrom).toJSON() : undefined,
      dateUntil: dayjs(eventProductOrder.dateUntil).isValid() ? dayjs(eventProductOrder.dateUntil).toJSON() : undefined,
    });
  }

  protected convertDateFromServerEPO(res: EntityResponseType_EPO): EntityResponseType_EPO {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
      res.body.dateFrom = res.body.dateFrom ? dayjs(res.body.dateFrom) : undefined;
      res.body.dateUntil = res.body.dateUntil ? dayjs(res.body.dateUntil) : undefined;
    }
    return res;
  }

  updateEventServiceMapOrder(eventServiceMapOrder: IEventServiceMapOrder): Observable<EntityResponseType_ESMO> {
    const copy = this.convertDateFromClientESMO(eventServiceMapOrder);
    return this.http
      .put<IEventServiceMapOrder>(`${this.resourceUrl_event_service_map_orders}/${eventServiceMapOrder.id}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType_ESMO) => this.convertDateFromServerESMO(res)));
  }

  protected convertDateFromClientESMO(eventServiceMapOrder: IEventServiceMapOrder): IEventServiceMapOrder {
    return Object.assign({}, eventServiceMapOrder, {
      date: dayjs(eventServiceMapOrder.date).isValid() ? dayjs(eventServiceMapOrder.date).toJSON() : undefined,
      dateFrom: dayjs(eventServiceMapOrder.dateFrom).isValid() ? dayjs(eventServiceMapOrder.dateFrom).toJSON() : undefined,
      dateUntil: dayjs(eventServiceMapOrder.dateUntil).isValid() ? dayjs(eventServiceMapOrder.dateUntil).toJSON() : undefined,
    });
  }

  protected convertDateFromServerESMO(res: EntityResponseType_ESMO): EntityResponseType_ESMO {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
      res.body.dateFrom = res.body.dateFrom ? dayjs(res.body.dateFrom) : undefined;
      res.body.dateUntil = res.body.dateUntil ? dayjs(res.body.dateUntil) : undefined;
    }
    return res;
  }

  findWidthAuthorities(): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrl_cye}/loggedIn`, { observe: 'response' });
  }

  findUsersWidthAuthoritiesQuery(login: string): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrl_cye}/${login}/findByLogin`, { observe: 'response' });
  }

  findAddressByLocationId(addressId: number): Observable<HttpResponse<IAddress>> {
    return this.http.get<IAddress>(`${this.resourceUrlAddress}/${addressId}/findByLocationId`, { observe: 'response' });
  }

  findWidthAuthoritiesWidthId(id: string): Observable<EntityResponseType> {
    return this.http.get<IUser>(`${this.resourceUrl}/${id}/byId`, { observe: 'response' });
  }

  findWorksheetsByEventId(id: number): Observable<HttpResponse<IWorksheet[]>> {
    return this.http.get<IWorksheet[]>(`${this.resourceUrl_worksheet}/${id}/allByEventId`, { observe: 'response' });
  }

  findEventProductRatingsByEventIdAndProductId(eventId: number, productId: number): Observable<HttpResponse<IEventProductRating[]>> {
    return this.http.get<IEventProductRating[]>(`${this.resourceUrl_eventproductrating}/${eventId}/${productId}`, { observe: 'response' });
  }

  findImagesByProductId(productId: number): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${productId}/imagesFromProductId`, { observe: 'response' });
  }

  findImagesByProductIdAndUserId(productId: number, userId: string): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${productId}/${userId}/imagesFromProductIdAndUserId`, {
      observe: 'response',
    });
  }

  findImagesByShopId(shopId: number): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${shopId}/imagesFromShopId`, { observe: 'response' });
  }

  findImagesByShopIdAndUserId(shopId: number, userId: string): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${shopId}/${userId}/imagesFromShopIdAndUserId`, {
      observe: 'response',
    });
  }

  findImagesByOrganizationId(organizationId: number): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${organizationId}/imagesFromOrganizationId`, { observe: 'response' });
  }

  findImagesByOrganizationIdAndUserId(organizationId: number, userId: string): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${organizationId}/${userId}/imagesFromOrganizationIdAndUserId`, {
      observe: 'response',
    });
  }

  findImagesByServiceId(serviceId: number): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${serviceId}/imagesFromServiceId`, { observe: 'response' });
  }

  findImagesByServiceIdAndUserId(serviceId: number, userId: string): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${serviceId}/${userId}/imagesFromServiceIdAndUserId`, {
      observe: 'response',
    });
  }

  findImagesByEventId(eventId: number): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${eventId}/imagesFromEventId`, { observe: 'response' });
  }

  findImagesByEventIdAndUserId(eventId: number, userId: string): Observable<HttpResponse<IImage[]>> {
    return this.http.get<IImage[]>(`${this.resourceUrl_image}/${eventId}/${userId}/imagesFromEventIdAndUserId`, {
      observe: 'response',
    });
  }

  findShopLikeDislikeByShopId(shopId: number): Observable<HttpResponse<IShopLikeDislike[]>> {
    return this.http.get<IShopLikeDislike[]>(`${this.resourceUrl_shop_like_dislikes}/${shopId}/getShopLikeDislikeByShopId`, {
      observe: 'response',
    });
  }

  findServiceLikeDislikeByServiceId(serviceId: number): Observable<HttpResponse<IServiceLikeDislike[]>> {
    return this.http.get<IServiceLikeDislike[]>(`${this.resourceUrl_service_like_dislikes}/${serviceId}/getServiceLikeDislikeByServiceId`, {
      observe: 'response',
    });
  }

  findShopLikeDislikeByShopIdAndUserId(shopId: number, userId: string): Observable<HttpResponse<IShopLikeDislike[]>> {
    return this.http.get<IShopLikeDislike[]>(
      `${this.resourceUrl_shop_like_dislikes}/${shopId}/${userId}/getShopLikeDislikeByShopIdAndUserId`,
      {
        observe: 'response',
      }
    );
  }

  findOrganizationLikeDislikeByOrganizationId(shopId: number): Observable<HttpResponse<IOrganizationLikeDislike[]>> {
    return this.http.get<IOrganizationLikeDislike[]>(
      `${this.resourceUrl_organization_like_dislikes}/${shopId}/getOrganizationLikeDislikeByOrganizationId`,
      {
        observe: 'response',
      }
    );
  }

  findOrganizationLikeDislikeByOrganizationIdAndUserId(
    shopId: number,
    userId: string
  ): Observable<HttpResponse<IOrganizationLikeDislike[]>> {
    return this.http.get<IOrganizationLikeDislike[]>(
      `${this.resourceUrl_organization_like_dislikes}/${shopId}/${userId}/getOrganizationLikeDislikeByOrganizationIdAndUserId`,
      {
        observe: 'response',
      }
    );
  }

  findServiceLikeDislikeByServiceIdAndUserId(serviceId: number, userId: string): Observable<HttpResponse<IServiceLikeDislike[]>> {
    return this.http.get<IServiceLikeDislike[]>(
      `${this.resourceUrl_service_like_dislikes}/${serviceId}/${userId}/getServiceLikeDislikeByServiceIdAndUserId`,
      {
        observe: 'response',
      }
    );
  }

  findShopCommentByShopId(shopId: number): Observable<HttpResponse<IShopComment[]>> {
    return this.http.get<IShopComment[]>(`${this.resourceUrl_shop_comments}/${shopId}/getShopCommentByShopId`, { observe: 'response' });
  }

  findServiceCommentByServiceId(serviceId: number): Observable<HttpResponse<IServiceComment[]>> {
    return this.http.get<IServiceComment[]>(`${this.resourceUrl_service_comments}/${serviceId}/getServiceCommentByServiceId`, {
      observe: 'response',
    });
  }

  findOrganizationCommentByOrganizationId(organizationId: number): Observable<HttpResponse<IOrganizationComment[]>> {
    return this.http.get<IOrganizationComment[]>(
      `${this.resourceUrl_organization_comments}/${organizationId}/getOrganizationCommentByOrganizationId`,
      {
        observe: 'response',
      }
    );
  }

  findShopCommentByShopIdAndUserId(shopId: number, userId: string): Observable<HttpResponse<IShopComment[]>> {
    return this.http.get<IShopComment[]>(`${this.resourceUrl_shop_comments}/${shopId}/${userId}/getShopCommentByShopIdAndUserId`, {
      observe: 'response',
    });
  }

  findProductCommentByProductId(productId: number): Observable<HttpResponse<IProductComment[]>> {
    return this.http.get<IProductComment[]>(`${this.resourceUrl_product_comments}/${productId}/getProductCommentByProductId`, {
      observe: 'response',
    });
  }

  findProductCommentByProductIdAndUserId(productId: number, userId: string): Observable<HttpResponse<IProductComment[]>> {
    return this.http.get<IProductComment[]>(
      `${this.resourceUrl_product_comments}/${productId}/${userId}/getProductCommentByProductIdAndUserId`,
      {
        observe: 'response',
      }
    );
  }

  findProductLikeDislikeByProductId(productId: number): Observable<HttpResponse<IProductLikeDislike[]>> {
    return this.http.get<IProductLikeDislike[]>(`${this.resourceUrl_product_like_dislikes}/${productId}/getProductLikeDislikeByProductId`, {
      observe: 'response',
    });
  }

  findProductLikeDislikeByProductIdAndUserId(productId: number, userId: string): Observable<HttpResponse<IProductLikeDislike[]>> {
    return this.http.get<IProductLikeDislike[]>(
      `${this.resourceUrl_product_like_dislikes}/${productId}/${userId}/getProductLikeDislikeByProductIdAndUserId`,
      {
        observe: 'response',
      }
    );
  }

  findEventCommentByEventId(eventId: number): Observable<HttpResponse<IEventComment[]>> {
    return this.http.get<IEventComment[]>(`${this.resourceUrl_event_comments}/${eventId}/getEventCommentByEventId`, {
      observe: 'response',
    });
  }

  findEventCommentByEventIdAndUserId(eventId: number, userId: string): Observable<HttpResponse<IEventComment[]>> {
    return this.http.get<IEventComment[]>(`${this.resourceUrl_event_comments}/${eventId}/${userId}/getEventCommentByEventIdAndUserId`, {
      observe: 'response',
    });
  }

  findEventLikeDislikeByEventId(eventId: number): Observable<HttpResponse<IEventLikeDislike[]>> {
    return this.http.get<IEventLikeDislike[]>(`${this.resourceUrl_event_like_dislikes}/${eventId}/getEventLikeDislikeByEventId`, {
      observe: 'response',
    });
  }

  findEventLikeDislikeByEventIdAndUserId(eventId: number, userId: string): Observable<HttpResponse<IEventLikeDislike[]>> {
    return this.http.get<IEventLikeDislike[]>(
      `${this.resourceUrl_event_like_dislikes}/${eventId}/${userId}/getEventLikeDislikeByEventIdAndUserId`,
      {
        observe: 'response',
      }
    );
  }

  findEventsByUserId(userId: string): Observable<HttpResponse<IEvent[]>> {
    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/events/user/active/${userId}`, { observe: 'response' });
  }

  findEventByIsPublicAndActive(req?: any): Observable<HttpResponse<IEvent[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/public/active`, { params: options, observe: 'response' });
  }

  findEventyByPrivateOrPublicAndActiveTrueAndDateEndAfter(dateEnd: dayjs.Dayjs): Observable<HttpResponse<IEvent[]>> {
    const de = dateEnd.format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(de));
    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/dateEnd/public/active`, { params: params, observe: 'response' });
  }

  findEventyByPrivateOrPublicAndActiveTrueAndDateEndBefor(dateEnd: dayjs.Dayjs): Observable<HttpResponse<IEvent[]>> {
    const de = dateEnd.format();
    let params = new HttpParams();
    params = params.append('dateEnd', encodeURIComponent(de));
    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/dateEnd/befor/public/active`, { params: params, observe: 'response' });
  }

  findShopByActiveTrue(): Observable<HttpResponse<IShop[]>> {
    return this.http.get<IShop[]>(`${this.resourceUrl_shop}/active`, { observe: 'response' });
  }

  findShopByActiveTrueAndActiveOwnerTrue(): Observable<HttpResponse<IShop[]>> {
    return this.http.get<IShop[]>(`${this.resourceUrl_shop}/active/activeOwner`, { observe: 'response' });
  }

  findOrganisationsByActiveTrue(): Observable<HttpResponse<IOrganization[]>> {
    return this.http.get<IOrganization[]>(`${this.resourceUrl_organizations}/active`, { observe: 'response' });
  }

  findOrganizationsByActiveTrueAndActiveOwnerTrue(): Observable<HttpResponse<IOrganization[]>> {
    return this.http.get<IOrganization[]>(`${this.resourceUrl_organizations}/active/activeOwner`, { observe: 'response' });
  }

  findEventProductOrdersByProductId(productId: number, req?: any): Observable<HttpResponse<IEventProductOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventProductOrder[]>(`${this.resourceUrl_eventProductOrder}/${productId}/getEventProductOrderByProduct`, {
      params: options,
      observe: 'response',
    });
  }

  findEventProductOrdersByEventId(eventId: number, req?: any): Observable<HttpResponse<IEventProductOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventProductOrder[]>(`${this.resourceUrl_eventProductOrder}/${eventId}/getProductsByEvent`, {
      params: options,
      observe: 'response',
    });
  }

  findAllProductsByShopId(shopId: number, req?: any): Observable<HttpResponse<IProduct[]>> {
    const options = createRequestOption(req);
    return this.http.get<IProduct[]>(`${this.resourceUrl_product}/${shopId}/all`, { params: options, observe: 'response' });
  }

  findAllChatMessagesByMessageToAndDateSeenIsNull(userToId: string): Observable<HttpResponse<IChatMessage[]>> {
    return this.http.get<IChatMessage[]>(`${this.resourceUrl_chat}/${userToId}/messageToAndDateSeenIsNull`, { observe: 'response' });
  }

  findAllEventProductOrdersByDateStartBetween(
    dateStartFrom: dayjs.Dayjs,
    dateStartUntil: dayjs.Dayjs
  ): Observable<HttpResponse<IEventProductOrder[]>> {
    return this.http.get<IEventProductOrder[]>(
      `${this.resourceUrl_eventProductOrder}/${dateStartFrom}/${dateStartUntil}/findAllByDateStartBetween`,
      { observe: 'response' }
    );
  }

  findAllEventProductOrdersByProductIdAndDateStartBetween(
    productId: number,
    dateStartFrom: dayjs.Dayjs,
    dateStartUntil: dayjs.Dayjs
  ): Observable<HttpResponse<IEventProductOrder[]>> {
    const dSF = dateStartFrom.format();
    const dSU = dateStartUntil.format();
    let params = new HttpParams();
    params = params.append('dateStartFrom', encodeURIComponent(dSF));
    params = params.append('dateStartUntil', encodeURIComponent(dSU));

    return this.http.get<IEventProductOrder[]>(`${this.resourceUrl_eventProductOrder}/${productId}/findAllByProductIdAndDateStartBetween`, {
      params: params,
      observe: 'response',
    });
  }

  findAllEventProductOrdersByProductIdAndDateUntilBetween(
    productId: number,
    dateStartFrom: dayjs.Dayjs,
    dateStartUntil: dayjs.Dayjs
  ): Observable<HttpResponse<IEventProductOrder[]>> {
    const dSF = dateStartFrom.format();
    const dSU = dateStartUntil.format();
    let params = new HttpParams();
    params = params.append('dateStartFrom', encodeURIComponent(dSF));
    params = params.append('dateStartUntil', encodeURIComponent(dSU));

    return this.http.get<IEventProductOrder[]>(`${this.resourceUrl_eventProductOrder}/${productId}/findAllByProductIdAndDateUntilBetween`, {
      params: params,
      observe: 'response',
    });
  }

  findAllEventProductOrdersByShopId(shopId: number): Observable<HttpResponse<IEventProductOrder[]>> {
    return this.http.get<IEventProductOrder[]>(`${this.resourceUrl_eventProductOrder}/${shopId}/getEventProductOrdersByShopId`, {
      observe: 'response',
    });
  }

  findAllEventProductOrdersByProductIdAndDateFromGreaterThenAndDateUntilSmallerThen(
    productId: number,
    dateStartFrom: dayjs.Dayjs,
    dateStartUntil: dayjs.Dayjs
  ): Observable<HttpResponse<IEventProductOrder[]>> {
    const dSF = dateStartFrom.format();
    const dSU = dateStartUntil.format();
    let params = new HttpParams();
    params = params.append('dateStartFrom', encodeURIComponent(dSF));
    params = params.append('dateStartUntil', encodeURIComponent(dSU));

    return this.http.get<IEventProductOrder[]>(
      `${this.resourceUrl_eventProductOrder}/${productId}/findAllWithProductIdAndDateFromGreaterThenAndDateUntilSmallerThen`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventsByIsPublicAndActive(req?: any): Observable<HttpResponse<IEvent[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/public/active`, { params: options, observe: 'response' });
  }

  findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(dateEnd: dayjs.Dayjs): Observable<HttpResponse<IEvent[]>> {
    const d = dateEnd.format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(d));

    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/dateEnd/public/active`, { params: params, observe: 'response' });
  }

  getEventsFromUserAndActive(userId: string, req?: any): Observable<HttpResponse<IEvent[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/user/active/${userId}`, { params: options, observe: 'response' });
  }

  findEventsByPrivateOrPublicAndActiveTrueAndDateStartBetween(
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IEvent[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('betweenStart', encodeURIComponent(s));
    params = params.append('betweenEnd', encodeURIComponent(e));

    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/between/public/active`, { params: params, observe: 'response' });
  }

  getServicesFromUserAndActive(userId: string, req?: any): Observable<HttpResponse<ICreateYourEventService[]>> {
    const options = createRequestOption(req);
    return this.http.get<ICreateYourEventService[]>(`${this.resourceUrl_service}/user/active/${userId}`, {
      params: options,
      observe: 'response',
    });
  }

  getServiceFromServiceMapId(serviceMapId: number, req?: any): Observable<HttpResponse<ICreateYourEventService[]>> {
    const options = createRequestOption(req);
    return this.http.get<ICreateYourEventService[]>(`${this.resourceUrl_service}/active/serviceMap/${serviceMapId}`, {
      params: options,
      observe: 'response',
    });
  }

  findByCreateYourEventServiceId(serviceId: number, req?: any): Observable<HttpResponse<IServiceMap[]>> {
    const options = createRequestOption(req);
    return this.http.get<IServiceMap[]>(`${this.resourceUrl_servicemaps}/byServiceId/${serviceId}`, {
      params: options,
      observe: 'response',
    });
  }

  getServicesWhereActive(req?: any): Observable<HttpResponse<ICreateYourEventService[]>> {
    const options = createRequestOption(req);
    return this.http.get<ICreateYourEventService[]>(`${this.resourceUrl_service}/active`, { params: options, observe: 'response' });
  }

  getServicesWhereActiveAndActiveOwnerTrue(req?: any): Observable<HttpResponse<ICreateYourEventService[]>> {
    const options = createRequestOption(req);
    return this.http.get<ICreateYourEventService[]>(`${this.resourceUrl_service}/active/activeOwner`, {
      params: options,
      observe: 'response',
    });
  }

  getAllServiceOffersByServiceMapId(serviceMapId: number, req?: any): Observable<HttpResponse<IServiceOffer[]>> {
    const options = createRequestOption(req);
    return this.http.get<IServiceOffer[]>(`${this.resourceUrl_serviceoffers}/byServiceMapId/${serviceMapId}`, {
      params: options,
      observe: 'response',
    });
  }

  getAllEventServiceMapsOrdersByServiceMapId(serviceMapId: number, req?: any): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/${serviceMapId}/getAllEventServiceMapsOrdersByServiceMapId`,
      { params: options, observe: 'response' }
    );
  }

  getAllEventServiceMapsOrdersByServiceMapIdAndEventConfirmed(
    serviceMapId: number,
    req?: any
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/${serviceMapId}/getAllEventServiceMapsOrdersByServiceMapIdAndEventConfirmed`,
      { params: options, observe: 'response' }
    );
  }

  getAllEventServiceMapsOrdersByEventId(eventId: number, req?: any): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/${eventId}/getAllEventServiceMapsOrdersByEventId`,
      { params: options, observe: 'response' }
    );
  }

  findAllEventServiceMapOrdersWithDateRange(
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('betweenStart', encodeURIComponent(s));
    params = params.append('betweenEnd', encodeURIComponent(e));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/findAllEventServiceMapOrdersWithDateRange`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventServiceMapOrdersWithDateRangeAndServiceMapId(
    serviceMapId: number,
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('betweenStart', encodeURIComponent(s));
    params = params.append('betweenEnd', encodeURIComponent(e));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/findAllEventServiceMapOrdersWithDateRangeAndServiceMapId/${serviceMapId}`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventServiceMapOrdersWithDateRangeAndEventId(
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs,
    eventId: number
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('betweenStart', encodeURIComponent(s));
    params = params.append('betweenEnd', encodeURIComponent(e));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/findAllEventServiceMapOrdersWithDateRangeAndEventId/${eventId}`,
      { params: params, observe: 'response' }
    );
  }

  findAllOrganizationReservationsWithDateRange(
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IOrganizationReservation[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('betweenStart', encodeURIComponent(s));
    params = params.append('betweenEnd', encodeURIComponent(e));
    return this.http.get<IOrganizationReservation[]>(
      `${this.resourceUrl_organization_reservations}/findAllIOrganizationReservationsWithDateRange`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventProductOrdersWithDateRange(dateStart: dayjs.Dayjs, dateEnd: dayjs.Dayjs): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('betweenStart', encodeURIComponent(s));
    params = params.append('betweenEnd', encodeURIComponent(e));
    return this.http.get<IEventServiceMapOrder[]>(`${this.resourceUrl_eventProductOrder}/findAllEventProductOrdersWithDateFromRange`, {
      params: params,
      observe: 'response',
    });
  }

  /* --------------------------------------------------------------------------------------------------------------------------------------------------- */

  findAllEventProductOrdersWithDateFromRange(
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('dateStart', encodeURIComponent(s));
    params = params.append('dateEnd', encodeURIComponent(e));
    return this.http.get<IEventServiceMapOrder[]>(`${this.resourceUrl_eventProductOrder}/findAllEventProductOrdersWithDateFromRange`, {
      params: params,
      observe: 'response',
    });
  }

  findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween(
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('dateStart', encodeURIComponent(s));
    params = params.append('dateEnd', encodeURIComponent(e));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_eventProductOrder}/findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBetween`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen(
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('dateStart', encodeURIComponent(s));
    params = params.append('dateEnd', encodeURIComponent(e));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_eventProductOrder}/findAllEventProductOrdersWithDateFromBetweenAndDateUntilBiggerThen`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange(
    dateStart: dayjs.Dayjs,
    dateEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = dateStart.format();
    const e = dateEnd.format();
    let params = new HttpParams();
    params = params.append('dateStart', encodeURIComponent(s));
    params = params.append('dateEnd', encodeURIComponent(e));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_eventProductOrder}/findAllEventProductOrdersWithDateFromSmallerThenAndDateUntilBiggerThenAndOnSameTimeRange`,
      { params: params, observe: 'response' }
    );
  }

  /* --------------------------------------------------------------------------------------------------------------------------------------------------- */

  findAllEventServiceMapOrdersByDateUntilLessGreaterThanNow(now: dayjs.Dayjs): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = now.format();
    let params = new HttpParams();
    params = params.append('now', encodeURIComponent(s));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/findAllEventServiceMapOrdersByDateUntilLessGreaterThanNow`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventProductOrderByDateGreaterThen(now: dayjs.Dayjs): Observable<HttpResponse<IEventProductOrder[]>> {
    const s = now.format();
    let params = new HttpParams();
    params = params.append('now', encodeURIComponent(s));
    return this.http.get<IEventProductOrder[]>(`${this.resourceUrl_eventProductOrder}/findAllEventProductOrderByDateGreaterThen`, {
      params: params,
      observe: 'response',
    });
  }

  findShopsByUserAndActiveTrue(req?: any): Observable<HttpResponse<IShop[]>> {
    const options = createRequestOption(req);
    return this.http.get<IShop[]>(`${this.resourceUrl_shop}/user/active`, { params: options, observe: 'response' });
  }

  findShopsByUserIdAndActiveTrue(userId: string, req?: any): Observable<HttpResponse<IShop[]>> {
    const options = createRequestOption(req);
    return this.http.get<IShop[]>(`${this.resourceUrl_shop}/${userId}/active`, { params: options, observe: 'response' });
  }

  findByUserIdAndActiveTrueAndPrivateOrPublic(req?: any): Observable<HttpResponse<IEvent[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/public/active/user`, { params: options, observe: 'response' });
  }

  getEventStarRatingByEventAndUser(eventId: number, userId: string, req?: any): Observable<HttpResponse<IEventStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventStarRating[]>(
      `${this.resourceUrl_event_star_ratings}/${eventId}/${userId}/getEventStarRatingByEventAndUser`,
      { params: options, observe: 'response' }
    );
  }

  getEventStarRatingByEvent(eventId: number, req?: any): Observable<HttpResponse<IEventStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventStarRating[]>(`${this.resourceUrl_event_star_ratings}/${eventId}/getEventStarRatingByEvent`, {
      params: options,
      observe: 'response',
    });
  }

  getEventStarRatingByUser(userId: string, req?: any): Observable<HttpResponse<IEventStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventStarRating[]>(`${this.resourceUrl_event_star_ratings}/${userId}/getEventStarRatingByUser`, {
      params: options,
      observe: 'response',
    });
  }

  findAllWhereStarsBiggerAs(stars: number, req?: any): Observable<HttpResponse<IEventStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventStarRating[]>(`${this.resourceUrl_event_star_ratings}/${stars}/findAllWhereStarsBiggerAs`, {
      params: options,
      observe: 'response',
    });
  }

  createReservation(reservation: IReservation): Observable<HttpResponse<IReservation>> {
    const copy = this.convertDateFromClient_Reservations(reservation);
    return this.http
      .post<IReservation>(`${this.resourceUrl_reservation}/ext`, copy, { observe: 'response' })
      .pipe(map((res: HttpResponse<IReservation>) => this.convertDateFromServer_Reservations(res)));
  }

  updateReservation(reservation: IReservation): Observable<HttpResponse<IReservation>> {
    const copy = this.convertDateFromClient_Reservations(reservation);
    return this.http
      .put<IReservation>(`${this.resourceUrl_reservation}/${reservation.id}/ext`, copy, { observe: 'response' })
      .pipe(map((res: HttpResponse<IReservation>) => this.convertDateFromServer_Reservations(res)));
  }

  partialUpdateReservation(reservation: IReservation): Observable<HttpResponse<IReservation>> {
    const copy = this.convertDateFromClient_Reservations(reservation);
    return this.http
      .patch<IReservation>(`${this.resourceUrl_reservation}/${reservation.id}/ext`, copy, { observe: 'response' })
      .pipe(map((res: HttpResponse<IReservation>) => this.convertDateFromServer_Reservations(res)));
  }

  deleteReservation(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_reservation}/${id}/ext`, { observe: 'response' });
  }

  protected convertDateFromClient_Reservations(reservation: IReservation): IReservation {
    return Object.assign({}, reservation, {
      date: reservation.date?.isValid() ? reservation.date.toJSON() : undefined,
      accessDate: reservation.accessDate?.isValid() ? reservation.accessDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer_Reservations(res: HttpResponse<IReservation>): HttpResponse<IReservation> {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
      res.body.accessDate = res.body.accessDate ? dayjs(res.body.accessDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer_Reservations(res: HttpResponse<IReservation[]>): HttpResponse<IReservation[]> {
    if (res.body) {
      res.body.forEach((reservation: IReservation) => {
        reservation.date = reservation.date ? dayjs(reservation.date) : undefined;
        reservation.accessDate = reservation.accessDate ? dayjs(reservation.accessDate) : undefined;
      });
    }
    return res;
  }

  getReservationsByUser(userId: string, req?: any): Observable<HttpResponse<IReservation[]>> {
    const options = createRequestOption(req);
    return this.http.get<IReservation[]>(`${this.resourceUrl_reservation}/${userId}/getReservationsByUserId`, {
      params: options,
      observe: 'response',
    });
  }

  getReservationsByUserAndBilled(userId: string, req?: any): Observable<HttpResponse<IReservation[]>> {
    const options = createRequestOption(req);
    return this.http.get<IReservation[]>(`${this.resourceUrl_reservation}/${userId}/getReservationsByUserIdAndBilled`, {
      params: options,
      observe: 'response',
    });
  }

  getReservationsByUserAndNotBilled(userId: string, req?: any): Observable<HttpResponse<IReservation[]>> {
    const options = createRequestOption(req);
    return this.http.get<IReservation[]>(`${this.resourceUrl_reservation}/${userId}/getReservationsByUserIdAndNotBilled`, {
      params: options,
      observe: 'response',
    });
  }

  findAllEventsByActiveTrueAndBilledFalseAndDateEndBefor(date: dayjs.Dayjs): Observable<HttpResponse<IEvent[]>> {
    const d = date.format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(d));

    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/dateBefor/active/notBilled`, { params: params, observe: 'response' });
  }

  findEventById(eventId: number): Observable<HttpResponse<IEvent>> {
    return this.http.get<IEvent>(`${this.resourceUrl_event}/findById/${eventId}`, { observe: 'response' });
  }

  findAllEventsByActiveTrueAndBilledFalseAndDateEndBeforAndUserId(date: dayjs.Dayjs, userId: string): Observable<HttpResponse<IEvent[]>> {
    const d = date.format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(d));

    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/dateBefor/active/notBilled/${userId}`, {
      params: params,
      observe: 'response',
    });
  }

  findAllEventsByActiveTrueAndBilledTrueAndDateEndBeforAndUserId(date: dayjs.Dayjs, userId: string): Observable<HttpResponse<IEvent[]>> {
    const d = date.format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(d));

    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/dateBefor/active/billed/${userId}`, {
      params: params,
      observe: 'response',
    });
  }

  findAllEventsByActiveTrueAndDateEndBeforAndUserId(date: dayjs.Dayjs, userId: string): Observable<HttpResponse<IEvent[]>> {
    const d = date.format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(d));

    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/dateBefor/active/${userId}`, {
      params: params,
      observe: 'response',
    });
  }

  findAllEventsByActiveTrueAndDateEndAfterAndUserId(date: dayjs.Dayjs, userId: string): Observable<HttpResponse<IEvent[]>> {
    const d = date.format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(d));

    return this.http.get<IEvent[]>(`${this.resourceUrl_event}/dateAfter/active/${userId}`, {
      params: params,
      observe: 'response',
    });
  }

  findAllEventProductOrderByShopIdAndBilledFalseAndDateStartSmallerThen(
    shopId: number,
    now: dayjs.Dayjs
  ): Observable<HttpResponse<IEventProductOrder[]>> {
    const s = now.format();
    let params = new HttpParams();
    params = params.append('now', encodeURIComponent(s));
    return this.http.get<IEventProductOrder[]>(
      `${this.resourceUrl_eventProductOrder}/${shopId}/findAllEventProductOrderByShopIdAndBilledFalseAndDateStartSmallerThen`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventProductOrderByShopIdAndBilledTrueAndDateStartSmallerThen(
    shopId: number,
    now: dayjs.Dayjs
  ): Observable<HttpResponse<IEventProductOrder[]>> {
    const s = now.format();
    let params = new HttpParams();
    params = params.append('now', encodeURIComponent(s));
    return this.http.get<IEventProductOrder[]>(
      `${this.resourceUrl_eventProductOrder}/${shopId}/findAllEventProductOrderByShopIdAndBilledTrueAndDateStartSmallerThen`,
      { params: params, observe: 'response' }
    );
  }

  findAllEventProductOrderByShopIdAndDateStartSmallerThen(
    shopId: number,
    now: dayjs.Dayjs
  ): Observable<HttpResponse<IEventProductOrder[]>> {
    const s = now.format();
    let params = new HttpParams();
    params = params.append('now', encodeURIComponent(s));
    return this.http.get<IEventProductOrder[]>(
      `${this.resourceUrl_eventProductOrder}/${shopId}/findAllEventProductOrderByShopIdAndDateStartSmallerThen`,
      { params: params, observe: 'response' }
    );
  }

  findEventServiceMapOrdersByServiceMapIdAndBilledFalseAndDateEndSmallerThen(
    serviceMapId: number,
    now: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = now.format();
    let params = new HttpParams();
    params = params.append('now', encodeURIComponent(s));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/${serviceMapId}/findEventServiceMapOrdersByServiceMapIdAndBilledFalseAndDateEndSmallerThen`,
      { params: params, observe: 'response' }
    );
  }

  findEventServiceMapOrdersByServiceMapIdAndDateEndSmallerThen(
    serviceMapId: number,
    now: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = now.format();
    let params = new HttpParams();
    params = params.append('now', encodeURIComponent(s));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/${serviceMapId}/findEventServiceMapOrdersByServiceMapIdAndDateEndSmallerThen`,
      { params: params, observe: 'response' }
    );
  }

  findEventServiceMapOrdersByServiceMapIdAndBilledTrueAndDateEndSmallerThen(
    serviceMapId: number,
    now: dayjs.Dayjs
  ): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const s = now.format();
    let params = new HttpParams();
    params = params.append('now', encodeURIComponent(s));
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/${serviceMapId}/findEventServiceMapOrdersByServiceMapIdAndBilledTrueAndDateEndSmallerThen`,
      { params: params, observe: 'response' }
    );
  }

  deleteProductTag(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_tags}/deleteProduct/${id}`, { observe: 'response' });
  }

  deleteEventTag(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_tags}/deleteEvent/${id}`, { observe: 'response' });
  }

  deleteShopTag(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_tags}/deleteShop/${id}`, { observe: 'response' });
  }

  deleteServiceTag(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_tags}/deleteService/${id}`, { observe: 'response' });
  }

  deleteOrganization(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_tags}/deleteOrganization/${id}`, { observe: 'response' });
  }

  findProductTags(id: number): Observable<HttpResponse<ITags[]>> {
    return this.http.get<ITags[]>(`${this.resourceUrl_tags}/findProduct/${id}`, { observe: 'response' });
  }

  findEventTags(id: number): Observable<HttpResponse<ITags[]>> {
    return this.http.get<ITags[]>(`${this.resourceUrl_tags}/findEvent/${id}`, { observe: 'response' });
  }

  findShopTags(id: number): Observable<HttpResponse<ITags[]>> {
    return this.http.get<ITags[]>(`${this.resourceUrl_tags}/findShop/${id}`, { observe: 'response' });
  }

  findServiceTags(id: number): Observable<HttpResponse<ITags[]>> {
    return this.http.get<ITags[]>(`${this.resourceUrl_tags}/findService/${id}`, { observe: 'response' });
  }

  findOrganizations(id: number): Observable<HttpResponse<ITags[]>> {
    return this.http.get<ITags[]>(`${this.resourceUrl_tags}/findOrganization/${id}`, { observe: 'response' });
  }

  findAllTags(): Observable<HttpResponse<ITags[]>> {
    return this.http.get<ITags[]>(`${this.resourceUrl_tags}/all`, { observe: 'response' });
  }

  find50TagsRandomly(): Observable<HttpResponse<ITags[]>> {
    return this.http.get<ITags[]>(`${this.resourceUrl_tags}/50`, { observe: 'response' });
  }

  find50EventTagsRandomly(): Observable<HttpResponse<ITags[]>> {
    const t = this.http.get<ITags[]>(`${this.resourceUrl_tags}/50event`, { observe: 'response' });
    return t;
  }

  findAllTagsWithActiveTrue(): Observable<HttpResponse<ITags[]>> {
    return this.http.get<ITags[]>(`${this.resourceUrl_tags}/active/all`, { observe: 'response' });
  }

  findPointsByKey(key: String): Observable<HttpResponse<IPoint>> {
    return this.http.get<IPoint>(`${this.resourceUrl_points}/key/${key}`, { observe: 'response' });
  }

  updateUserLoggedIn(id: string, loggedIn: boolean): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${id}/${loggedIn}`, { observe: 'response' });
  }

  updateUserLoggedInAndPoints(userId: string, loggedIn: boolean, points: number): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${userId}/${loggedIn}/${points}`, { observe: 'response' });
  }

  updateAddressAndPhoneFromUser(userId: string, address: string, phone: string): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${userId}/update/${encodeURIComponent(address)}/${encodeURIComponent(phone)}`, {
      observe: 'response',
    });
  }

  updateAGBTrue(userId: string): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/updateAGBTrue/${userId}`, { observe: 'response' });
  }

  updateAddressAndPhoneAndIBanFromUser(userId: string, address: string, phone: string, iban: string): Observable<void> {
    return this.http.put<void>(
      `${this.resourceUrl}/${userId}/update/${encodeURIComponent(address)}/${encodeURIComponent(phone)}/${encodeURIComponent(iban)}`,
      { observe: 'response' }
    );
  }

  updateAddressAndPhoneAndIBanAndBanknameAndBankaddressFromUser(
    userId: string,
    address: string,
    phone: string,
    iban: string,
    bankname: string,
    bankaddress: string
  ): Observable<void> {
    //let params = new HttpParams().set('address',address).set('phone', phone);
    return this.http.put<void>(
      `${this.resourceUrl}/${userId}/update/${encodeURIComponent(address)}/${encodeURIComponent(phone)}/${encodeURIComponent(
        iban
      )}/${encodeURIComponent(bankname)}/${encodeURIComponent(bankaddress)}`,
      { observe: 'response' }
    );
  }

  getAllPointsFromUser(userId: string): Observable<HttpResponse<IUserPointAssociation[]>> {
    return this.http.get<IUserPointAssociation[]>(`${this.resourceUrl_pointsUsers}/${userId}/getAllPointsFromUser`, {
      observe: 'response',
    });
  }

  findUserPointAssociationByUsersIdAndDateBetween(
    userId: string,
    betweenStart: dayjs.Dayjs,
    betweenEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IUserPointAssociation[]>> {
    const s = betweenStart.format();
    const e = betweenEnd.format();
    let params = new HttpParams();
    params = params.append('betweenStart', encodeURIComponent(s));
    params = params.append('betweenEnd', encodeURIComponent(e));
    return this.http.get<IUserPointAssociation[]>(`${this.resourceUrl_pointsUsers}/${userId}/findByUsersIdAndDateBetween`, {
      params: params,
      observe: 'response',
    });
  }

  findUserPointAssociationByUsersIdAndPointkeyAndDateBetween(
    userId: string,
    key: string,
    betweenStart: dayjs.Dayjs,
    betweenEnd: dayjs.Dayjs
  ): Observable<HttpResponse<IUserPointAssociation[]>> {
    const s = betweenStart.format();
    const e = betweenEnd.format();
    let params = new HttpParams();
    params = params.append('betweenStart', encodeURIComponent(s));
    params = params.append('betweenEnd', encodeURIComponent(e));
    return this.http.get<IUserPointAssociation[]>(
      `${this.resourceUrl_pointsUsers}/${userId}/${key}/findByUsersIdAndPointkeyAndDateBetween`,
      { params: params, observe: 'response' }
    );
  }

  findUserPointAssociationByUsersIdAndPointkey(userId: string, key: string): Observable<HttpResponse<IUserPointAssociation[]>> {
    return this.http.get<IUserPointAssociation[]>(`${this.resourceUrl_pointsUsers}/${userId}/${key}/findByUsersIdAndPointkey`, {
      observe: 'response',
    });
  }

  findShopStarRatingsByShopId(shopId: number): Observable<HttpResponse<IShopStarRating[]>> {
    return this.http.get<IShopStarRating[]>(`${this.resourceUrl_shop_star_rating}/${shopId}/findShopStarRatingsByShopId`, {
      observe: 'response',
    });
  }

  findShopStarRatingsByShopIdAndUserId(shopId: number, userId: string): Observable<HttpResponse<IShopStarRating>> {
    return this.http.get<IShopStarRating>(`${this.resourceUrl_shop_star_rating}/${shopId}/${userId}/findShopStarRatingsByShopIdAndUserId`, {
      observe: 'response',
    });
  }

  findOrganizationStarRatingsByOrganizationId(organizationId: number): Observable<HttpResponse<IOrganizationStarRating[]>> {
    return this.http.get<IOrganizationStarRating[]>(
      `${this.resourceUrl_organization_star_ratings}/${organizationId}/findOrganizationStarRatingsByOrganizationId`,
      {
        observe: 'response',
      }
    );
  }

  findOrganizationStarRatingsByOrganizationIdAndUserId(
    organizationId: number,
    userId: string
  ): Observable<HttpResponse<IOrganizationStarRating>> {
    return this.http.get<IOrganizationStarRating>(
      `${this.resourceUrl_organization_star_ratings}/${organizationId}/${userId}/findOrganizationStarRatingsByOrganizationIdAndUserId`,
      {
        observe: 'response',
      }
    );
  }

  findServiceStarRatingsByServiceId(serviceId: number): Observable<HttpResponse<IServiceStarRating[]>> {
    return this.http.get<IServiceStarRating[]>(`${this.resourceUrl_service_star_rating}/${serviceId}/findServiceStarRatingsByServiceId`, {
      observe: 'response',
    });
  }

  findServiceStarRatingsByServiceIdAndUserId(serviceId: number, userId: string): Observable<HttpResponse<IServiceStarRating>> {
    return this.http.get<IServiceStarRating>(
      `${this.resourceUrl_service_star_rating}/${serviceId}/${userId}/findServiceStarRatingsByServiceIdAndUserId`,
      { observe: 'response' }
    );
  }

  findGiftsByActiveTrue(): Observable<HttpResponse<IGift[]>> {
    return this.http.get<IGift[]>(`${this.resourceUrl_gifts}/active`, { observe: 'response' });
  }

  findBondsByCode(code: string): Observable<HttpResponse<IBond[]>> {
    return this.http.get<IBond[]>(`${this.resourceUrl_bond}/findByCode/${code}`, { observe: 'response' });
  }

  findPropertyByKey(key: string): Observable<HttpResponse<IProperty>> {
    return this.http.get<IProperty>(`${this.resourceUrl_properties}/key/${key}`, { observe: 'response' });
  }

  findProductStarRatingsByProductId(productId: number): Observable<HttpResponse<IProductStarRating[]>> {
    return this.http.get<IProductStarRating[]>(`${this.resourceUrl_product_star_rating}/${productId}/findProductStarRatingsByProductId`, {
      observe: 'response',
    });
  }

  findProductStarRatingsByProductIdAndUserId(productId: number, userId: string): Observable<HttpResponse<IProductStarRating>> {
    return this.http.get<IProductStarRating>(
      `${this.resourceUrl_product_star_rating}/${productId}/${userId}/findProductStarRatingsByProductIdAndUserId`,
      { observe: 'response' }
    );
  }

  findChipsCollectionByUserId(userId: string): Observable<HttpResponse<IChipsCollection>> {
    return this.http.get<IChipsCollection>(`${this.resourceUrl_chips_collections}/${userId}/findChipsCollectionByUserId`, {
      observe: 'response',
    });
  }

  findAllChipsCollectionChipsByChipsCollectionId(id: number): Observable<HttpResponse<IChipsCollectionChips[]>> {
    return this.http.get<IChipsCollectionChips[]>(
      `${this.resourceUrl_chips_collection_chips}/${id}/findAllChipsCollectionChipsByChipsCollectionId`,
      { observe: 'response' }
    );
  }

  findOndChipsCollectionChipsByChipsCollectionIdAndChipsId(
    collectionId: number,
    chipsId: number
  ): Observable<HttpResponse<IChipsCollectionChips>> {
    return this.http.get<IChipsCollectionChips>(
      `${this.resourceUrl_chips_collection_chips}/${collectionId}/${chipsId}/findOneChipsCollectionChipsByChipsCollectionIdAndChipsId`,
      { observe: 'response' }
    );
  }

  deleteAllChipsCollectionChips(): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl_chips_collection_chips}/deleteAllChipsCollectionChips`, { observe: 'response' });
  }

  findAllProductsWhereShopActiveAndProductActive(req?: any): Observable<HttpResponse<IProduct[]>> {
    const options = createRequestOption(req);
    return this.http.get<IProduct[]>(`${this.resourceUrl_product}/shop/product/active`, { params: options, observe: 'response' });
  }

  findAllIGiftShoppingCartsByUserId(userId: string, req?: any): Observable<HttpResponse<IGiftShoppingCart[]>> {
    const options = createRequestOption(req);
    return this.http.get<IGiftShoppingCart[]>(`${this.resourceUrl_gift_shopping_carts}/${userId}/findByUserId`, {
      params: options,
      observe: 'response',
    });
  }

  findAllPartnersWhereActiveTrue(req?: any): Observable<HttpResponse<IPartner[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPartner[]>(`${this.resourceUrl_partners}/active`, { params: options, observe: 'response' });
  }

  findDeliveryTypeByProductId(id: number, req?: any): Observable<HttpResponse<IDeliveryType[]>> {
    const options = createRequestOption(req);
    return this.http.get<IDeliveryType[]>(`${this.resourceUrl_delivery_types}/${id}/findDeliveryTypeByProductId`, {
      params: options,
      observe: 'response',
    });
  }

  deleteDeliveryTypesByProductId(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl_delivery_types}/${id}/deleteByProductId`, { observe: 'response' });
  }

  findMp3ByServiceIdAndUserId(serviceId: number, userId: string): Observable<HttpResponse<IMp3[]>> {
    return this.http.get<IMp3[]>(`${this.resourceUrl_mp3}/${userId}/${serviceId}/service`, {
      observe: 'response',
    });
  }

  findMp3ByServiceId(serviceId: number): Observable<HttpResponse<IMp3[]>> {
    return this.http.get<IMp3[]>(`${this.resourceUrl_mp3}/${serviceId}/service`, {
      observe: 'response',
    });
  }

  findMp3ByProductIdAndUserId(productId: number, userId: string): Observable<HttpResponse<IMp3[]>> {
    return this.http.get<IMp3[]>(`${this.resourceUrl_mp3}/${userId}/${productId}/product`, {
      observe: 'response',
    });
  }

  findMp3ByProductId(productId: number): Observable<HttpResponse<IMp3[]>> {
    return this.http.get<IMp3[]>(`${this.resourceUrl_mp3}/${productId}/product`, {
      observe: 'response',
    });
  }

  findMp3ByEventIdAndUserId(eventId: number, userId: string): Observable<HttpResponse<IMp3[]>> {
    return this.http.get<IMp3[]>(`${this.resourceUrl_mp3}/${userId}/${eventId}/event`, {
      observe: 'response',
    });
  }

  findMp3ByEventId(eventId: number): Observable<HttpResponse<IMp3[]>> {
    return this.http.get<IMp3[]>(`${this.resourceUrl_mp3}/${eventId}/event`, {
      observe: 'response',
    });
  }

  findMp3ByShopIdAndUserId(shopId: number, userId: string): Observable<HttpResponse<IMp3[]>> {
    return this.http.get<IMp3[]>(`${this.resourceUrl_mp3}/${userId}/${shopId}/shop`, {
      observe: 'response',
    });
  }

  findMp3ByShopId(shopId: number): Observable<HttpResponse<IMp3[]>> {
    return this.http.get<IMp3[]>(`${this.resourceUrl_mp3}/${shopId}/shop`, {
      observe: 'response',
    });
  }

  deleteMP3(mp3Id: number): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl_music_del}/${mp3Id}/delete`, {
      observe: 'response',
    });
  }

  findShopCommentsByEager(): Observable<HttpResponse<IShopComment[]>> {
    return this.http.get<IShopComment[]>(`${this.resourceUrl_shop_comments}/findAllByEager`, { observe: 'response' });
  }

  getTransactionIdFromDatatrans(amount: number, type: string, id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl_datatrans}/${amount}/${type}/${id}`, { observe: 'response' });
  }

  getStatusFromTransactionIdFromDatatrans(id: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl_datatrans}/txId/${id}`, { observe: 'response' });
  }

  findTicketsByEventId(eventId: number): Observable<HttpResponse<ITicket[]>> {
    return this.http.get<ITicket[]>(`${this.resourceUrl_tickets}/${eventId}/getAllTicketsByEventId`, {
      observe: 'response',
    });
  }

  uploadPdf(data: FormData, reservationId: number, mail: string, lang: string): Observable<HttpResponse<void>> {
    let params = new HttpParams();
    params = params.append('mail', mail);

    return this.http.post<void>(`${this.resourceUrl_send_ticket}/${reservationId}/${lang}/uploadPdf`, data, {
      params: params,
      observe: 'response',
    });
  }

  findRestaurantsByUserAndActive(): Observable<HttpResponse<IRestaurant[]>> {
    return this.http.get<IRestaurant[]>(`${this.resourceUrl_restaurants}/byUser/active`, {
      observe: 'response',
    });
  }

  findHotelsByUserAndActive(): Observable<HttpResponse<IHotel[]>> {
    return this.http.get<IHotel[]>(`${this.resourceUrl_hotels}/byUser/active`, {
      observe: 'response',
    });
  }

  findClubsByUserAndActive(): Observable<HttpResponse<IClub[]>> {
    return this.http.get<IClub[]>(`${this.resourceUrl_clubs}/byUser/active`, {
      observe: 'response',
    });
  }

  findBuildingsByUserAndActive(): Observable<HttpResponse<IBuilding[]>> {
    return this.http.get<IBuilding[]>(`${this.resourceUrl_buildings}/byUser/active`, {
      observe: 'response',
    });
  }

  findOrganizationsByActiveAndActiveOwner(): Observable<HttpResponse<IOrganization[]>> {
    return this.http.get<IOrganization[]>(`${this.resourceUrl_organizations}/active/activeOwner`, {
      observe: 'response',
    });
  }

  findOrganizationReservationsByEventId(eventId: number): Observable<HttpResponse<IOrganizationReservation[]>> {
    return this.http.get<IOrganizationReservation[]>(
      `${this.resourceUrl_organization_reservations}/${eventId}/findOrganizationReservationsByEventId`,
      {
        observe: 'response',
      }
    );
  }

  findOrganizationReservationsByOrganizationId(eventId: number): Observable<HttpResponse<IOrganizationReservation[]>> {
    return this.http.get<IOrganizationReservation[]>(
      `${this.resourceUrl_organization_reservations}/${eventId}/findOrganizationReservationsByOrganizationId`,
      {
        observe: 'response',
      }
    );
  }

  findClubByOrganizationId(id: number): Observable<HttpResponse<IClub>> {
    return this.http.get<IClub>(`${this.resourceUrl_clubs}/${id}/clubByOrganizationId`, {
      observe: 'response',
    });
  }

  findHotelByOrganizationId(id: number): Observable<HttpResponse<IHotel>> {
    return this.http.get<IHotel>(`${this.resourceUrl_hotels}/${id}/hotelByOrganizationId`, {
      observe: 'response',
    });
  }

  findRestaurantByOrganizationId(id: number): Observable<HttpResponse<IRestaurant>> {
    return this.http.get<IRestaurant>(`${this.resourceUrl_restaurants}/${id}/restaurantByOrganizationId`, {
      observe: 'response',
    });
  }

  byActiveTrueAndUserIdAndDateUntilSmallerThanNow(userId: string): Observable<HttpResponse<IOrganizationReservation[]>> {
    return this.http.get<IOrganizationReservation[]>(
      `${this.resourceUrl_organization_reservations}/${userId}/byActiveTrueAndUserIdAndDateUntilSmallerThanNow`,
      {
        observe: 'response',
      }
    );
  }

  findOrganizationReservationsByOrganizationWithUserId(userId: string): Observable<HttpResponse<IOrganizationReservation[]>> {
    return this.http.get<IOrganizationReservation[]>(
      `${this.resourceUrl_organization_reservations}/${userId}/findOrganizationReservationsByOrganizationWithUserId`,
      {
        observe: 'response',
      }
    );
  }

  findEventServiceMapOrdersByEventDateEndSmallerThenNow(req?: any): Observable<HttpResponse<IEventServiceMapOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<IEventServiceMapOrder[]>(
      `${this.resourceUrl_event_service_map_orders}/findEventServiceMapOrdersByEventDateEndSmallerThenNow`,
      { params: options, observe: 'response' }
    );
  }

  deleteAllSlotListPlum(): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl_slot_list_plum}/deleteAll`, {
      observe: 'response',
    });
  }

  deleteAllSlotListOrange(): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl_slot_list_orange}/deleteAll`, {
      observe: 'response',
    });
  }

  deleteAllSlotListCherry(): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl_slot_list_cherry}/deleteAll`, {
      observe: 'response',
    });
  }

  deleteAllSlotListClock(): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl_slot_list_clock}/deleteAll`, {
      observe: 'response',
    });
  }

  findCouponsByActiveUser(): Observable<HttpResponse<ICoupon[]>> {
    return this.http.get<ICoupon[]>(`${this.resourceUrl_coupons}/byUser`, {
      observe: 'response',
    });
  }

  findCouponsByUser(userId: string): Observable<HttpResponse<ICoupon[]>> {
    return this.http.get<ICoupon[]>(`${this.resourceUrl_coupons}/${userId}/byUser`, {
      observe: 'response',
    });
  }
}
