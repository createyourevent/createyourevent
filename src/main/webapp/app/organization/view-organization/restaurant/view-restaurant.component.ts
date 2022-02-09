import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvent } from 'app/entities/event/event.model';
import { IImage } from 'app/entities/image/image.model';
import { IMp3 } from 'app/entities/mp-3/mp-3.model';
import { IOrganizationComment, OrganizationComment } from 'app/entities/organization-comment/organization-comment.model';
import { OrganizationCommentService } from 'app/entities/organization-comment/service/organization-comment.service';
import { IOrganizationLikeDislike, OrganizationLikeDislike } from 'app/entities/organization-like-dislike/organization-like-dislike.model';
import { OrganizationLikeDislikeService } from 'app/entities/organization-like-dislike/service/organization-like-dislike.service';
import { OrganizationStarRating } from 'app/entities/organization-star-rating/organization-star-rating.model';
import { OrganizationStarRatingService } from 'app/entities/organization-star-rating/service/organization-star-rating.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { GoogleGeocodeService } from 'app/google-geocode.service';
import { OrganisatorService } from 'app/organisator/organisator.service';
import dayjs from 'dayjs';
import { JhiDataUtils } from 'ng-jhipster';

@Component({
  selector: 'jhi-view-restaurant',
  templateUrl: './view-restaurant.component.html',
  styleUrls: ['./view-restaurant.component.scss']
})
export class ViewRestaurantComponent implements OnInit {

  restaurant: IRestaurant | null = null;
  images: IImage[] = [];
  like = 0;
  dislike = 0;
  likeDislike: IOrganizationLikeDislike[] = [];
  rated = false;
  user!: IUser;
  comments!: IOrganizationComment[];
  stars = 0;
  ratedStars = false;
  loading = false;
  events: IEvent[] = [];

  // Address Organization
  address = '';
  place = '';
  land = '';

  options: any;
  overlays!: any[];
  map!: google.maps.Map;

  mp3s: IMp3[] = [];

  constructor( protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    private organisatorService: OrganisatorService,
    private generalService: GeneralService,
    private organizationLikeDislikeService: OrganizationLikeDislikeService,
    private organizationCommentService: OrganizationCommentService,
    private organizationStarRatingService: OrganizationStarRatingService,
    private googleGeocoderService: GoogleGeocodeService) { }

  ngOnInit() {
    this.loading = true;

    this.options = {
      center: {lat: 0.00, lng: 0.00},
      zoom: 12
    };

    this.activatedRoute.data.subscribe(({ restaurant }) => {
      this.restaurant = restaurant;

      this.generalService.findOrganizationReservationsByOrganizationId(this.restaurant.organization.id).subscribe(r => {
        const reservations = r.body;
        reservations.forEach(ele => {
          if(ele.event.reservations === null) {
            ele.event.reservations = [];
          }
          this.events.push(ele.event);
        })
        this.events = [...new Set(this.events)];
      });

      this.formatAddress();

      this.generalService.findImagesByOrganizationId(this.restaurant.organization?.id!).subscribe(res => {
        this.images = res.body!;
      });

      this.generalService.findOrganizationLikeDislikeByOrganizationId(this.restaurant.organization?.id!).subscribe(res => {
        this.likeDislike = res.body!;
        this.calcLike();
        this.calcDislike();
      });
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body!;

        this.generalService.findOrganizationLikeDislikeByOrganizationIdAndUserId(this.restaurant.organization?.id!, this.user.id!).subscribe(res => {
          if (res.body!.length === 0) {
            this.rated = false;
          } else {
            this.rated = true;
          }
        });
        this.generalService.findOrganizationStarRatingsByOrganizationIdAndUserId(this.restaurant.organization.id!, this.user.id!).subscribe(res => {
          if(res.body !== null) {
            this.ratedStars = true;
            this.stars = res.body!.stars!;
          }
        });
      });
      this.generalService.findOrganizationCommentByOrganizationId(this.restaurant.organization?.id!).subscribe(res => {
        this.comments = res.body!;
      });

      let latOrganization = 0;
      let lngOrganization = 0;
      let posOrganization: google.maps.LatLng;
      const queryParam = restaurant.organization.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
        const geocoder = res.body!['results'];
        const geometry = geocoder[0].geometry;
        latOrganization = geometry.location.lat;
        lngOrganization = geometry.location.lng;
        posOrganization = new google.maps.LatLng(latOrganization, lngOrganization);
        this.map.setCenter(posOrganization);
        this.overlays = [
          new google.maps.Marker({position: posOrganization, title: this.restaurant.organization.name}),
        ];
      });
      this.loading = false;
    });
  }

  setMap(event: any): void {
    this.map = event.map;
  }

  formatAddress(): void {
    const googleAddressArray = this.restaurant.organization.address?.split(',');
    this.address = googleAddressArray![0];
    this.place = googleAddressArray![1];
    this.land = googleAddressArray![2];
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

  onVoted(l: any): void {
    const liked = l.liked;
    const comment = l.comment;
    if (liked) {
      // this.like++;
      this.onLiked(comment);
    } else {
      // this.dislike++;
      this.onDislike(comment);
    }
  }

  onCommented(comment: string): void {
    const organizationComment: OrganizationComment = new OrganizationComment();
    organizationComment.comment = comment;
    organizationComment.date = dayjs();
    organizationComment.user = this.user;
    organizationComment.organization = this.restaurant.organization;
    this.organizationCommentService.create(organizationComment).subscribe(() => {
      this.comments.push(organizationComment);
      this.ngOnInit();
    });
  }

  onAnswered(event: any): void {
    this.organizationCommentService.find(event.commentId).subscribe(comment => {
      const organizationComment: OrganizationComment = new OrganizationComment();
      organizationComment.comment = event.answer;
      organizationComment.organizationComment = comment.body;
      organizationComment.date = dayjs();
      organizationComment.user = this.user;
      organizationComment.organization = this.restaurant.organization;
      this.organizationCommentService.create(organizationComment).subscribe(sc => {
        comment.body.organizationComments.push(sc.body);
        this.organizationCommentService.update(comment.body).subscribe(() => {
          this.ngOnInit();
        });
      });
    });
  }

  onChangesStars(val: any): void {
    const organizationStarsRating: OrganizationStarRating = new OrganizationStarRating();
    organizationStarsRating.comment = val.comment;
    organizationStarsRating.date = dayjs();
    organizationStarsRating.user = this.user;
    organizationStarsRating.organization = this.restaurant.organization;
    organizationStarsRating.stars = val.stars;
    this.organizationStarRatingService.create(organizationStarsRating).subscribe(() => {
      this.ratedStars = true;
    });
  }

  onLiked(comment: string): void {
    const organizationLikeDislike = new OrganizationLikeDislike();
    organizationLikeDislike.like = 1;
    organizationLikeDislike.dislike = 0;
    organizationLikeDislike.organization = this.restaurant.organization;
    organizationLikeDislike.user = this.user;
    organizationLikeDislike.date = dayjs();
    organizationLikeDislike.comment = comment;
    this.organizationLikeDislikeService.create(organizationLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

  onDislike(comment: string): void {
    const organizationLikeDislike = new OrganizationLikeDislike();
    organizationLikeDislike.like = 0;
    organizationLikeDislike.dislike = 1;
    organizationLikeDislike.organization = this.restaurant.organization;
    organizationLikeDislike.user = this.user;
    organizationLikeDislike.date = dayjs();
    organizationLikeDislike.comment = comment;
    this.organizationLikeDislikeService.create(organizationLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

}
