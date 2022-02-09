
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { CreateYourEventServiceService } from 'app/entities/create-your-event-service/service/create-your-event-service.service';
import { IImage } from 'app/entities/image/image.model';
import { IMp3 } from 'app/entities/mp-3/mp-3.model';
import { IServiceComment, ServiceComment } from 'app/entities/service-comment/service-comment.model';
import { ServiceCommentService } from 'app/entities/service-comment/service/service-comment.service';
import { IServiceLikeDislike, ServiceLikeDislike } from 'app/entities/service-like-dislike/service-like-dislike.model';
import { ServiceLikeDislikeService } from 'app/entities/service-like-dislike/service/service-like-dislike.service';
import { IServiceMap } from 'app/entities/service-map/service-map.model';
import { ServiceStarRating } from 'app/entities/service-star-rating/service-star-rating.model';
import { ServiceStarRatingService } from 'app/entities/service-star-rating/service/service-star-rating.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { GoogleGeocodeService } from 'app/google-geocode.service';
import * as dayjs from 'dayjs';
import { JhiDataUtils } from 'ng-jhipster';


@Component({
  selector: 'jhi-create-your-event-service-detail',
  templateUrl: './create-your-event-service-detail.component.html',
  styleUrls: ['create-your-event-service-detail.component.scss']
})
export class CreateYourEventServiceDetailComponent implements OnInit {
  createYourEventService!: ICreateYourEventService;
  serviceId!: number;
  images!: IImage[];
  serviceMaps!: IServiceMap[];

  comments: IServiceComment[] = [];
  like = 0;
  dislike = 0;
  likeDislike: IServiceLikeDislike[] = [];
  rated = false;
  stars = 0;
  ratedStars = false;

  user!: IUser;

  options: any;
  overlays!: any[];
  map!: google.maps.Map;

  mp3s: IMp3[] = [];


    // Address Shop
    address = '';
    place = '';
    land = '';

  constructor(protected dataUtils: JhiDataUtils,
              protected activatedRoute: ActivatedRoute,
              private generalService: GeneralService,
              private serviceCommentService: ServiceCommentService,
              private serviceLikeDislikeService: ServiceLikeDislikeService,
              private route: ActivatedRoute,
              protected createYourEventServiceService: CreateYourEventServiceService,
              private serviceStarRatingService: ServiceStarRatingService,
              private googleGeocoderService: GoogleGeocodeService) {}


  setMap(event: any): void {
    this.map = event.map;
  }

  ngOnInit(): void {
    this.options = {
      center: {lat: 0.00, lng: 0.00},
      zoom: 12
    };

    this.serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));
    this.createYourEventServiceService.find(this.serviceId).subscribe(resser => {
      this.createYourEventService = resser.body!;
      this.formatAddress();

      this.generalService.findImagesByServiceId(this.createYourEventService.id).subscribe(resi => {
        this.images = resi.body!;
      });

      this.generalService.findMp3ByServiceId(this.createYourEventService.id).subscribe(mp3s => {
        this.mp3s = mp3s.body;
      });


      this.generalService.findServiceLikeDislikeByServiceId(this.createYourEventService?.id!).subscribe(res => {
        this.likeDislike = res.body!;
        this.calcLike();
        this.calcDislike();
      });
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body!;
        this.generalService.findServiceLikeDislikeByServiceIdAndUserId(this.createYourEventService?.id!, this.user.id!).subscribe(res => {
          if (res.body!.length === 0) {
            this.rated = true;
          }
        });

        this.generalService.findServiceStarRatingsByServiceIdAndUserId(this.serviceId, this.user.id!).subscribe(res => {
          if(res.body !== null) {
            this.ratedStars = true;
            this.stars = res.body!.stars!;
          }
        });
      });
      this.generalService.findServiceCommentByServiceId(this.createYourEventService?.id!).subscribe(res => {
        this.comments = res.body!;
      });
      this.generalService.findByCreateYourEventServiceId(this.serviceId).subscribe(res => {
        this.serviceMaps = res.body!;
      });

      let latService = 0;
      let lngService = 0;
      let posService: google.maps.LatLng;
      const queryParam = this.createYourEventService!.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
        const geocoder = res.body!['results'];
        const geometry = geocoder[0].geometry;
        latService = geometry.location.lat;
        lngService = geometry.location.lng;
        posService = new google.maps.LatLng(latService, lngService);
        this.map.setCenter(posService);
        this.overlays = [
          new google.maps.Marker({position: posService, title: this.createYourEventService.name}),
        ];
      });
    });
  }

  formatAddress(): void {
    const googleAddressArray = this.createYourEventService.address?.split(',');
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

  onVoted(e: any): void {
    if (e.liked) {
      this.like++;
      this.onLiked(e.comment);
    } else {
      this.dislike++;
      this.onDislike(e.comment);
    }
  }

  onChangesStars(val: any): void {
    const serviceStarsRating: ServiceStarRating = new ServiceStarRating();
    serviceStarsRating.comment = val.comment;
    serviceStarsRating.date = dayjs();
    serviceStarsRating.user = this.user;
    serviceStarsRating.service = this.createYourEventService;
    serviceStarsRating.stars = val.stars;
    this.serviceStarRatingService.create(serviceStarsRating).subscribe(() => {
      this.ratedStars = true;
    });
  }

  onAnswered(service: any): void {
    this.serviceCommentService.find(service.commentId).subscribe(comment => {
      const serviceComment: ServiceComment = new ServiceComment();
      serviceComment.comment = service.answer;
      serviceComment.serviceComment = comment.body;
      serviceComment.date = dayjs();
      serviceComment.user = this.user;
      serviceComment.createYourEventService = this.createYourEventService;
      this.serviceCommentService.create(serviceComment).subscribe(ec => {
        comment.body.serviceComments.push(ec.body);
        this.serviceCommentService.update(comment.body).subscribe(() => {
          this.ngOnInit();
        });
      });
    });
  }


  onCommented(comment: string): void {
    const serviceComment: ServiceComment = new ServiceComment();
    serviceComment.comment = comment;
    serviceComment.date = dayjs();
    serviceComment.user = this.user;
    serviceComment.createYourEventService = this.createYourEventService;
    this.serviceCommentService.create(serviceComment).subscribe(() => {
      this.comments.push(serviceComment);
      this.ngOnInit();
    });
  }

  onLiked(comment: string): void {
    const serviceLikeDislike = new ServiceLikeDislike();
    serviceLikeDislike.like = 1;
    serviceLikeDislike.dislike = 0;
    serviceLikeDislike.createYourEventService = this.createYourEventService;
    serviceLikeDislike.user = this.user;
    serviceLikeDislike.date = dayjs();
    serviceLikeDislike.comment = comment;
    this.serviceLikeDislikeService.create(serviceLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

  onDislike(comment: string): void {
    const serviceLikeDislike = new ServiceLikeDislike();
    serviceLikeDislike.like = 0;
    serviceLikeDislike.dislike = 1;
    serviceLikeDislike.createYourEventService = this.createYourEventService;
    serviceLikeDislike.user = this.user;
    serviceLikeDislike.date = dayjs();
    serviceLikeDislike.comment = comment;
    this.serviceLikeDislikeService.create(serviceLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }
}
