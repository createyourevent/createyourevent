import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IImage } from "app/entities/image/image.model";
import { IMp3 } from "app/entities/mp-3/mp-3.model";
import { IProduct } from "app/entities/product/product.model";
import { ShopCommentService } from "app/entities/shop-comment/service/shop-comment.service";
import { IShopComment, ShopComment } from "app/entities/shop-comment/shop-comment.model";
import { ShopLikeDislikeService } from "app/entities/shop-like-dislike/service/shop-like-dislike.service";
import { IShopLikeDislike, ShopLikeDislike } from "app/entities/shop-like-dislike/shop-like-dislike.model";
import { ShopStarRatingService } from "app/entities/shop-star-rating/service/shop-star-rating.service";
import { ShopStarRating } from "app/entities/shop-star-rating/shop-star-rating.model";
import { IShop } from "app/entities/shop/shop.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { GoogleGeocodeService } from "app/google-geocode.service";
import { OrganisatorService } from "app/organisator/organisator.service";
import * as dayjs from "dayjs";
import { JhiDataUtils } from "ng-jhipster";


@Component({
  selector: 'jhi-shop-overview',
  templateUrl: './shop-overview.component.html',
  styleUrls: ['shop-overview.component.scss']
})
export class ShopOverviewComponent implements OnInit {
  shop!: IShop;
  allProductsFromShop: IProduct[] = [];
  images: IImage[] = [];
  like = 0;
  dislike = 0;
  likeDislike: IShopLikeDislike[] = [];
  rated = false;
  user!: IUser;
  comments!: IShopComment[];
  stars = 0;
  ratedStars = false;
  loading = false;

  // Address Shop
  address = '';
  place = '';
  land = '';

  options: any;
  overlays!: any[];
  map!: google.maps.Map;

  mp3s: IMp3[] = [];



  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    private organisatorService: OrganisatorService,
    private generalService: GeneralService,
    private shopLikeDislikeService: ShopLikeDislikeService,
    private shopCommentService: ShopCommentService,
    private shopStarRatingService: ShopStarRatingService,
    private googleGeocoderService: GoogleGeocodeService
  ) {}

  setMap(event: any): void {
    this.map = event.map;
  }

  ngOnInit(): void {
    this.loading = true;
    this.options = {
      center: {lat: 0.00, lng: 0.00},
      zoom: 12
    };
    this.activatedRoute.data.subscribe(({ shop }) => {
      this.shop = shop;

      this.generalService.findMp3ByShopId(this.shop.id).subscribe(mp3s => {
        this.mp3s = mp3s.body;
      });

      this.formatAddress();
      this.organisatorService.queryProductsWithShopIdAndActive(this.shop?.id!).subscribe(res => {
        this.allProductsFromShop = res.body!;
      });
      this.generalService.findImagesByShopId(this.shop?.id!).subscribe(res => {
        this.images = res.body!;
      });
      this.generalService.findShopLikeDislikeByShopId(this.shop?.id!).subscribe(res => {
        this.likeDislike = res.body!;
        this.calcLike();
        this.calcDislike();
      });
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body!;

        this.generalService.findShopLikeDislikeByShopIdAndUserId(this.shop?.id!, this.user.id!).subscribe(res => {
          if (res.body!.length === 0) {
            this.rated = false;
          } else {
            this.rated = true;
          }
        });
        this.generalService.findShopStarRatingsByShopIdAndUserId(this.shop.id!, this.user.id!).subscribe(res => {
          if(res.body !== null) {
            this.ratedStars = true;
            this.stars = res.body!.stars!;
          }
        });
      });
      this.generalService.findShopCommentByShopId(this.shop?.id!).subscribe(res => {
        this.comments = res.body!;
      });

      let latShop = 0;
      let lngShop = 0;
      let posShop: google.maps.LatLng;
      const queryParam = shop.address!.replace(' ', '+');
      this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
        const geocoder = res.body!['results'];
        const geometry = geocoder[0].geometry;
        latShop = geometry.location.lat;
        lngShop = geometry.location.lng;
        posShop = new google.maps.LatLng(latShop, lngShop);
        this.map.setCenter(posShop);
        this.overlays = [
          new google.maps.Marker({position: posShop, title: this.shop.name}),
        ];
      });
      this.loading = false;
    });
  }

  formatAddress(): void {
    const googleAddressArray = this.shop.address?.split(',');
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
    const shopComment: ShopComment = new ShopComment();
    shopComment.comment = comment;
    shopComment.date = dayjs();
    shopComment.user = this.user;
    shopComment.shop = this.shop;
    this.shopCommentService.create(shopComment).subscribe(() => {
      this.comments.push(shopComment);
      this.ngOnInit();
    });
  }

  onAnswered(event: any): void {
    this.shopCommentService.find(event.commentId).subscribe(comment => {
      const shopComment: ShopComment = new ShopComment();
      shopComment.comment = event.answer;
      shopComment.shopComment = comment.body;
      shopComment.date = dayjs();
      shopComment.user = this.user;
      shopComment.shop = this.shop;
      this.shopCommentService.create(shopComment).subscribe(sc => {
        comment.body.shopComments.push(sc.body);
        this.shopCommentService.update(comment.body).subscribe(() => {
          this.ngOnInit();
        });
      });
    });
  }

  onChangesStars(val: any): void {
    const shopStarsRating: ShopStarRating = new ShopStarRating();
    shopStarsRating.comment = val.comment;
    shopStarsRating.date = dayjs();
    shopStarsRating.user = this.user;
    shopStarsRating.shop = this.shop;
    shopStarsRating.stars = val.stars;
    this.shopStarRatingService.create(shopStarsRating).subscribe(() => {
      this.ratedStars = true;
    });
  }

  onLiked(comment: string): void {
    const shopLikeDislike = new ShopLikeDislike();
    shopLikeDislike.like = 1;
    shopLikeDislike.dislike = 0;
    shopLikeDislike.shop = this.shop;
    shopLikeDislike.user = this.user;
    shopLikeDislike.date = dayjs();
    shopLikeDislike.comment = comment;
    this.shopLikeDislikeService.create(shopLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

  onDislike(comment: string): void {
    const shopLikeDislike = new ShopLikeDislike();
    shopLikeDislike.like = 0;
    shopLikeDislike.dislike = 1;
    shopLikeDislike.shop = this.shop;
    shopLikeDislike.user = this.user;
    shopLikeDislike.date = dayjs();
    shopLikeDislike.comment = comment;
    this.shopLikeDislikeService.create(shopLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }
}
