import { HttpResponse, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "app/app.constants";
import { IAddress } from "app/entities/address/address.model";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { IEventProductRating } from "app/entities/event-product-rating/event-product-rating.model";
import { IEvent } from "app/entities/event/event.model";
import { ILocation } from "app/entities/location/location.model";
import { IUser } from "app/entities/user/user.model";
import { Observable } from "rxjs";


type EntityResponseType = HttpResponse<IUser>;

@Injectable({ providedIn: 'root' })
export class EventService {
  public resourceUrl = SERVER_API_URL + 'api/users';
  public resourceUrlEventrating = SERVER_API_URL + 'api/eventratings';
  public resourceUrlEvent = SERVER_API_URL + 'api/events';
  public resourceUrlEventProductRating = SERVER_API_URL + 'api/event-product-ratings';
  public resourceUrlWishlistEntry = SERVER_API_URL + 'api/wishlist-entries';
  public resourceUrlEventProductOrder = SERVER_API_URL + 'api/event-product-orders';
  public resourceUrlLocation = SERVER_API_URL + 'api/locations';
  public resourceUrlAddress = SERVER_API_URL + 'api/addresses';
  public resourceUrlEventProductRatingComment = SERVER_API_URL + 'api/event-product-rating-comments';

  constructor(protected http: HttpClient) {}

  findWidthAuthorities(): Observable<EntityResponseType> {
    return this.http.get<IUser>(`${this.resourceUrl}/all`, { observe: 'response' });
  }

  findEvent(id: number):  Observable<HttpResponse<IEvent>> {
    return this.http.get<IEvent>(`${this.resourceUrlEvent}/${id}`, { observe: 'response' });
  }

  findEventProductRatingByEventAndProductAndUser(
    eventId: number,
    productId: number,
    userId: string
  ): Observable<HttpResponse<IEventProductRating>> {
    return this.http.get<IEventProductRating>(`${this.resourceUrlEventProductRating}/${eventId}/${productId}/${userId}`, {
      observe: 'response'
    });
  }

  findEventProductRatingByEventAndProduct(eventId: number, productId: number): Observable<HttpResponse<IEventProductRating[]>> {
    return this.http.get<IEventProductRating[]>(`${this.resourceUrlEventProductRating}/${eventId}/${productId}`, { observe: 'response' });
  }

  getProductsWithEventId(eventId: number): Observable<HttpResponse<IEventProductOrder[]>> {
    return this.http.get<IEventProductOrder[]>(`${this.resourceUrlEventProductOrder}/${eventId}/getProductsByEvent`, {
      observe: 'response'
    });
  }

  getEventProductOrderByProductAndUser(productId: number, userId: string): Observable<HttpResponse<IEventProductOrder>> {
    return this.http.get<IEventProductOrder>(`${this.resourceUrlEventProductOrder}/${productId}/${userId}/getByProductAndUser`, {
      observe: 'response'
    });
  }

  findLocationByEventId(eventId: number): Observable<HttpResponse<ILocation>> {
    return this.http.get<ILocation>(`${this.resourceUrlLocation}/${eventId}/findByEventId`, { observe: 'response' });
  }

  findAddressByLocationId(addressId: number): Observable<HttpResponse<IAddress>> {
    return this.http.get<IAddress>(`${this.resourceUrlAddress}/${addressId}/findByLocationId`, { observe: 'response' });
  }

  findEventProductRatingCommentByEventAndProduct(eventId: number, productId: number): Observable<HttpResponse<IEventProductRating[]>> {
    return this.http.get<IEventProductRating[]>(`${this.resourceUrlEventProductRatingComment}/${eventId}/${productId}`, {
      observe: 'response'
    });
  }
}
