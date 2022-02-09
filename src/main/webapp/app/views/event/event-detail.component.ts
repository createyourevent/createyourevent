
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IAddress } from "app/entities/address/address.model";
import { ProductType } from "app/entities/enumerations/product-type.model";
import { IEventComment, EventComment } from "app/entities/event-comment/event-comment.model";
import { EventCommentService } from "app/entities/event-comment/service/event-comment.service";
import { IEventLikeDislike, EventLikeDislike } from "app/entities/event-like-dislike/event-like-dislike.model";
import { EventLikeDislikeService } from "app/entities/event-like-dislike/service/event-like-dislike.service";
import { IEventProductOrder } from "app/entities/event-product-order/event-product-order.model";
import { IEventServiceMapOrder } from "app/entities/event-service-map-order/event-service-map-order.model";
import { EventStarRating } from "app/entities/event-star-rating/event-star-rating.model";
import { EventStarRatingService } from "app/entities/event-star-rating/service/event-star-rating.service";
import { IEvent } from "app/entities/event/event.model";
import { IImage } from "app/entities/image/image.model";
import { ILocation } from "app/entities/location/location.model";
import { IReservation, Reservation } from "app/entities/reservation/reservation.model";
import { ReservationService } from "app/entities/reservation/service/reservation.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";
import { OrganisatorService } from "app/organisator/organisator.service";
import { JhiDataUtils } from "ng-jhipster";
import * as dayjs from "dayjs";
import { EventService as EventUserService } from "./event.service";
import { IMp3 } from "app/entities/mp-3/mp-3.model";
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from "@techiediaries/ngx-qrcode";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { EventPaymentDialogComponent } from "./event-payment-dialog.component";
import { ReservedEventsService } from "../reserved-events/reserved-events.service";
import { EventStatus } from "app/entities/enumerations/event-status.model";
import { IOrganizationReservation } from "app/entities/organization-reservation/organization-reservation.model";
import { IOrganization } from "app/entities/organization/organization.model";
import { OrganizationType } from "app/entities/enumerations/organization-type.model";
import { RestaurantService } from "app/entities/restaurant/service/restaurant.service";
import { ClubService } from "app/entities/club/service/club.service";
import { HotelService } from "app/entities/hotel/service/hotel.service";

@Component({
  selector: 'jhi-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  providers:[MessageService, DialogService]
})
export class EventDetailComponent implements OnInit {
  loading = false;
  event!: IEvent;
  location!: ILocation;
  address!: IAddress;
  realEstateProducts: IEventProductOrder[] = [];
  foodProducts: IEventProductOrder[] = [];
  drinkProducts: IEventProductOrder[] = [];
  musicProducts: IEventProductOrder[] = [];
  lightshowProducts: IEventProductOrder[] = [];
  decorationProducts: IEventProductOrder[] = [];
  miscellaneousProducts: IEventProductOrder[] = [];
  currentRate = 0;
  allStars = 0;
  heartVal = 0;
  loggedIn = false;
  user!: IUser;
  isLoaded = false;
  participated = false;
  totalEntranceFee = 0;
  totalCost = 0;
  profit = 0;
  numberReservations = 0;
  maximumReservations = 0;
  reservations: IReservation[] = [];
  previousEarnings = 0;

  serviceMapsOrders!: IEventServiceMapOrder[];

  searchTextRealEstate = '';
  searchTextFood = '';
  searchTextDrink = '';
  searchTextMusic = '';
  searchTextLightshow = '';
  searchTextDecoration = '';
  searchTextShuttleservice = '';

  images!: IImage[];

  mp3s: IMp3[] = [];

  comments: IEventComment[] = [];
  like = 0;
  dislike = 0;
  likeDislike: IEventLikeDislike[] = [];
  rated = false;
  click_participated = false;

  options: any;
  overlays!: any[];

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value!: string;

  datatransTrxId: string;

  ref: DynamicDialogRef;

  isReserved = false;

  organizationReservations: IOrganizationReservation[];

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    protected eventUserService: EventUserService,
    private organisatorService: OrganisatorService,
    private reservationService: ReservationService,
    private generalService: GeneralService,
    private eventCommentService: EventCommentService,
    private eventLikeDislikeService: EventLikeDislikeService,
    private eventStarRatingService: EventStarRatingService,
    private googleGeocoderService: GoogleGeocodeService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private reservedEventsService: ReservedEventsService,
    protected router: Router,
    private restaurantService: RestaurantService,
    private clubService: ClubService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.reservedEventsService.favoriteRemovedEmitter.subscribe((data: IEvent) => {
      this.isReserved = false;
    });

    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;

      this.generalService.findOrganizationReservationsByEventId(event.id).subscribe(reservations => {
        this.organizationReservations = reservations.body;
      });

      this.value = 'https://createyourevent.org/events/' + this.event.id + '/view';
      this.generalService.findMp3ByEventId(this.event.id).subscribe(mp3s => {
        this.mp3s = mp3s.body;
      });

      let pos: google.maps.LatLng;
      this.generalService.findAddressByLocationId(this.event.location.id).subscribe(ad => {
        this.event.location.address = ad.body;
        const queryParam = this.event.location.address.address.replace(' ', '+');
        this.googleGeocoderService.getFromAddress(queryParam).subscribe((re: any) => {
          const geocoder = re.body['results'];
          const geometry = geocoder[0].geometry;
          pos = new google.maps.LatLng(geometry.location.lat, geometry.location.lng);
          this.options = {
            center: { lat: geometry.location.lat, lng: geometry.location.lng },
            zoom: 14
          };

          this.overlays = [new google.maps.Marker({ position: pos, title: this.event.name })];
        });

        this.generalService.getAllEventServiceMapsOrdersByEventId(this.event.id!).subscribe(esmo => {
          this.serviceMapsOrders = esmo.body;
          this.serviceMapsOrders.forEach(smo => {
            this.generalService.getServiceFromServiceMapId(smo.serviceMap.id).subscribe(ss => {
              ss.body.forEach(ele => {
                smo.serviceMap.createYourEventService = ele;
              });
            });
          })
        });




        this.organisatorService.findReservationsByEventId(this.event.id!).subscribe(reservations => {
          this.reservations = reservations.body;
          let total = 0;
          this.reservations.forEach(r => {
            total += r.ticket.amount;
          });
          this.numberReservations = total;
          this.maximumReservations = this.event.placenumber!;
          this.previousEarnings = this.event.price! * this.numberReservations;
        });

        this.eventUserService.getProductsWithEventId(this.event.id!).subscribe(epo => {
          epo.body.forEach(eventProductOrder => {

            this.totalCost += eventProductOrder.total!;

            if (eventProductOrder.product.productType === ProductType.REAL_ESTATE) {
              this.realEstateProducts.push(eventProductOrder);
            }
            if (eventProductOrder.product.productType === ProductType.FOOD) {
              this.foodProducts.push(eventProductOrder);
            }
            if (eventProductOrder.product.productType === ProductType.DRINK) {
              this.drinkProducts.push(eventProductOrder);
            }
            if (eventProductOrder.product.productType === ProductType.MUSIC) {
              this.musicProducts.push(eventProductOrder);
            }
            if (eventProductOrder.product.productType === ProductType.LIGHTSHOW) {
              this.lightshowProducts.push(eventProductOrder);
            }
            if (eventProductOrder.product.productType === ProductType.DECORATION) {
              this.decorationProducts.push(eventProductOrder);
            }
            if (eventProductOrder.product.productType === ProductType.MISCELLANEOUS) {
              this.miscellaneousProducts.push(eventProductOrder);
            }
          });
          this.totalEntranceFee += this.event.placenumber! * this.event.price!;
          this.profit = this.totalEntranceFee - this.totalCost;

          this.location = this.event.location!;
          this.address = this.location.address!;

          this.generalService.findImagesByEventId(this.event.id!).subscribe(res => {
            this.images = res.body!;
          });

          this.generalService.findEventCommentByEventId(this.event.id!).subscribe(res => {
            this.comments = res.body!;
          });

          this.generalService.findEventLikeDislikeByEventId(this.event.id!).subscribe(res => {
            this.likeDislike = res.body!;
            this.calcLike();
            this.calcDislike();
          });

          this.generalService.findWidthAuthorities().subscribe(u => {
            if(u.body) {
              this.user = u.body;
              this.hasReserved();
              this.generalService.getEventStarRatingByEvent(this.event.id!).subscribe(res => {
                const esrs = res.body!;
                esrs.forEach(esr => {
                  this.allStars += esr.stars!;
                });
                this.heartVal = (this.allStars / esrs.length / 10) * 5;
              });

              this.generalService.findEventLikeDislikeByEventIdAndUserId(this.event.id, this.user.id).subscribe(res => {
                if (res.body!.length > 0) {
                  this.rated = true;
                }
              });

              this.organisatorService.findReservationByUserIdAndEventId(this.user.id, this.event.id!).subscribe(reservation => {
                if (reservation.body.length > 0) this.participated = true;
                else this.participated = false;
              });

              this.generalService.getEventStarRatingByEventAndUser(this.event.id, this.user.id).subscribe(res => {
                res.body!.forEach(esr => {
                  this.currentRate = esr.stars!;
                });
              });
              this.loading = false;
            } else {
              this.loading = false;
            }
          });
        });
      });
    });
  }

  getBase64Image(img: any) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  /*
  download() {
    const qrcode = document.getElementById('qrcode');
    let doc = new jsPDF();

    let imageData= this.getBase64Image(qrcode.firstChild.firstChild);
    doc.addImage(imageData, "JPG", 10, 10);

    doc.save('FirstPdf.pdf');
  }

  */

  rateChange(e: any): void {
    this.generalService.getEventStarRatingByEventAndUser(this.event.id!, this.user.id).subscribe(res => {
      const esrs = res.body!;
      if (esrs.length === 0) {
        const esr = new EventStarRating();
        esr.stars = e;
        // esr.date = dayjs();
        esr.event = this.event;
        esr.user = this.user;
        this.eventStarRatingService.create(esr).subscribe();
      } else if (esrs.length === 1) {
        esrs[0].stars = e;
        this.eventStarRatingService.update(esrs[0]).subscribe();
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  hasParticipated(): boolean {
    if (this.participated) return true;
    else return false;
  }

  hasReserved(): void {
    const found = this.event.reservedUsers.findIndex(user => user.id === this.user.id);
    if(found >= 0) this.isReserved = true;
    else this.isReserved = false;
  }

  reserve(): void {
    this.event.reservedUsers.push(this.user);
    this.generalService.updateEvent(this.event).subscribe(() => {
      this.isReserved = true;
      this.reservedEventsService.favoriteAdded(this.event);
    });
  }

  openPaypalDialog(): void {
    this.ref = this.dialogService.open(EventPaymentDialogComponent, {
      header: 'Datatrans-Terminal',
      width: '70%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10,
      data: {
        event: this.event,
        user: this.user,
        type: 'event',
        id: this.event.id

      }
    });

    this.ref.onClose.subscribe((reservation: IReservation) => {
      if(reservation) {
        this.click_participated = false;
        this.participated = true;
      }
    });
  }

  isEventDefinitiv(): boolean {
    return this.event.definitelyConfirmed && this.event.status === EventStatus.DEFINITELY;
  }

  participate(): void {
    this.click_participated = true;
    const reservation: IReservation = new Reservation();
    reservation.event = this.event;
    reservation.user = this.user;
    this.reservationService.create(reservation).subscribe(() => {
      this.click_participated = false;
      this.participated = true;
    });
  }

  calcLike(): void {
    this.likeDislike.forEach(like => {
      this.like += like.like!;
    });
  }

  calcDislike(): void {
    this.likeDislike.forEach(like => {
      this.dislike += like.dislike!;
    });
  }

  onVoted(liked: any): void {
    if (liked) {
      this.like++;
      this.onLiked(liked.comment);
    } else {
      this.dislike++;
      this.onDislike(liked.comment);
    }
  }

  onCommented(comment: string): void {
    const eventComment: EventComment = new EventComment();
    eventComment.comment = comment;
    eventComment.date = dayjs();
    eventComment.user = this.user;
    eventComment.event = this.event;
    this.eventCommentService.create(eventComment).subscribe(() => {
      this.comments.push(eventComment);
      this.ngOnInit();
    });
  }


  onAnswered(event: any): void {
    this.eventCommentService.find(event.commentId).subscribe(comment => {
      const eventComment: EventComment = new EventComment();
      eventComment.comment = event.answer;
      eventComment.eventComment = comment.body;
      eventComment.date = dayjs();
      eventComment.user = this.user;
      eventComment.event = this.event;
      this.eventCommentService.create(eventComment).subscribe(ec => {
        comment.body.eventComments.push(ec.body);
        this.eventCommentService.update(comment.body).subscribe(() => {
          this.ngOnInit();
        });
      });
    });
  }

  onLiked(comment: string): void {
    const shopLikeDislike = new EventLikeDislike();
    shopLikeDislike.like = 1;
    shopLikeDislike.dislike = 0;
    shopLikeDislike.event = this.event;
    shopLikeDislike.user = this.user;
    shopLikeDislike.date = dayjs();
    shopLikeDislike.comment = comment;
    this.eventLikeDislikeService.create(shopLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

  onDislike(comment: string): void {
    const eventLikeDislike = new EventLikeDislike();
    eventLikeDislike.like = 0;
    eventLikeDislike.dislike = 1;
    eventLikeDislike.event = this.event;
    eventLikeDislike.user = this.user;
    eventLikeDislike.date = dayjs();
    eventLikeDislike.comment = comment;
    this.eventLikeDislikeService.create(eventLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

  getDate(): string {
    return dayjs(this.event.dateStart).format('YYYY-MM-DD hh:mm:ss');
  }

  flipCard(id: number) {
    const card = document.querySelector('.flipcard-' + id);
    card.classList.toggle('is-flipped');
  }

  formatAddress(address: string): string {

    const googleAddressArray = address.split(',');
    let fa = `
    ${googleAddressArray[0]}
    ${googleAddressArray[1]}
    ${googleAddressArray[2]}`;
    return fa;
  }

  goToOrganization(organization: IOrganization): void {
    if(organization.organizationType === OrganizationType.RESTAURANT) {
      this.generalService.findRestaurantByOrganizationId(organization.id).subscribe(r => {
        this.router.navigate(['/organization/' + r.body.id + '/restaurant']);
      });
    } else if(organization.organizationType === OrganizationType.HOTEL) {
      this.generalService.findHotelByOrganizationId(organization.id).subscribe(r => {
        this.router.navigate(['/organization/' + r.body.id + '/hotel']);
      });
    } else if(organization.organizationType === OrganizationType.CLUB) {
      this.generalService.findClubByOrganizationId(organization.id).subscribe(r => {
        this.router.navigate(['/organization/' + r.body.id + '/club']);
      });
    }
  }

  buyTickets(): void {
    this.router.navigate(['/events/' + this.event.id + '/buy-tickets']);
  }

  gotoSupplier(id: number): void {
    this.router.navigate(['/supplier/shop/' + id + '/overview']);
  }

}
