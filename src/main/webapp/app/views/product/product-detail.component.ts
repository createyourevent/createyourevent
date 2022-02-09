import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CloudData, CloudOptions } from "angular-tag-cloud-module";
import { IDeliveryType } from "app/entities/delivery-type/delivery-type.model";
import { IImage } from "app/entities/image/image.model";
import { IProductComment, ProductComment } from "app/entities/product-comment/product-comment.model";
import { ProductCommentService } from "app/entities/product-comment/service/product-comment.service";
import { IProductLikeDislike, ProductLikeDislike } from "app/entities/product-like-dislike/product-like-dislike.model";
import { ProductLikeDislikeService } from "app/entities/product-like-dislike/service/product-like-dislike.service";
import { ProductStarRating } from "app/entities/product-star-rating/product-star-rating.model";
import { ProductStarRatingService } from "app/entities/product-star-rating/service/product-star-rating.service";
import { IProduct } from "app/entities/product/product.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { JhiDataUtils } from "ng-jhipster";
import * as dayjs from "dayjs";
import { IMp3 } from "app/entities/mp-3/mp-3.model";


@Component({
  selector: 'jhi-product-detail-view',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: IProduct;
  public imagesUrl!: string[];
  currentRate = 0;
  user!: IUser;
  keywords: any[] = [];
  data: CloudData[] = [];
  images!: IImage[];
  comments: IProductComment[] = [];

  like = 0;
  dislike = 0;
  likeDislike: IProductLikeDislike[] = [];
  rated = false;
  color = '';

  stars = 0;
  ratedStars = false;

  mp3s: IMp3[] = [];

  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 0.5,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 200,
    overflow: true
  };

  deliveryMethods!: IDeliveryType[];

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private productCommentService: ProductCommentService,
    private productLikeDislikeService: ProductLikeDislikeService,
    private productStarRatingService: ProductStarRatingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;

      this.color = this.getRandomColor();
      /*
      const keywordString = this.product.keywords;
      const keywordArray = keywordString?.split('-----');
      keywordArray?.forEach(keyword => {
        this.keywords.push({ display: keyword, value: keyword });
        if(keyword !== '') {
          const rotation = -9 + Math.floor(Math.random() * Math.floor(20));
          const weight = Math.floor(Math.random() * Math.floor(10));
          this.data.push({ text: keyword, weight: weight, rotate: rotation });
        }

      });
      */
      this.generalService.findDeliveryTypeByProductId(this.product.id!).subscribe(res => {
        this.deliveryMethods = res.body!;
      });

      this.generalService.findMp3ByProductId(this.product.id).subscribe(mp3s => {
        this.mp3s = mp3s.body;
      });

      this.imagesUrl = [];
      this.imagesUrl.push('data:' + this.product.photoContentType + ';base64,' + this.product.photo);
      if (this.product.photo2ContentType != null) {
        this.imagesUrl.push('data:' + this.product.photo2ContentType + ';base64,' + this.product.photo2);
      }
      if (this.product.photo3ContentType != null) {
        this.imagesUrl.push('data:' + this.product.photo3ContentType + ';base64,' + this.product.photo3);
      }

      this.generalService.findProductLikeDislikeByProductId(this.product.id!).subscribe(res => {
        this.likeDislike = res.body!;
        this.calcLike();
        this.calcDislike();
      });

      this.generalService.findWidthAuthorities().subscribe(user => {
        this.user = user.body!;

        this.generalService.findProductLikeDislikeByProductIdAndUserId(this.product.id!, this.user.id).subscribe(res => {
          if (res.body!.length === 0) {
            this.rated = false;
          } else {
            this.rated = true;
          }
        });
        this.generalService.findProductStarRatingsByProductIdAndUserId(this.product.id!, this.user.id).subscribe(res => {
          if (res.body !== null) {
            this.ratedStars = true;
            this.stars = res.body!.stars!;
          }
        });
      });

      this.generalService.findImagesByProductId(this.product.id!).subscribe(res => {
        this.images = res.body!;
      });

      this.generalService.findProductCommentByProductId(this.product.id!).subscribe(res => {
        this.comments = res.body!;
      });
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

  getRandomColor(): string {
    const c = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    return c;
  }

  gotoShop(shopId: number): void {
    this.router.navigate(['/supplier/shop/' + shopId + '/overview']);
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

  onAnswered(product: any): void {
    this.productCommentService.find(product.commentId).subscribe(comment => {
      const productComment: ProductComment = new ProductComment();
      productComment.comment = product.answer;
      productComment.productComment = comment.body;
      productComment.date = dayjs();
      productComment.user = this.user;
      productComment.product = this.product;
      this.productCommentService.create(productComment).subscribe(ec => {
        comment.body.productComments.push(ec.body);
        this.productCommentService.update(comment.body).subscribe(() => {
          this.ngOnInit();
        });
      });
    });
  }

  onCommented(comment: string): void {
    const productComment: ProductComment = new ProductComment();
    productComment.comment = comment;
    productComment.date = dayjs();
    productComment.user = this.user;
    productComment.product = this.product;
    this.productCommentService.create(productComment).subscribe(() => {
      this.comments.push(productComment);
      this.ngOnInit();
    });
  }

  onChangesStars(val: any): void {
    const productStarsRating: ProductStarRating = new ProductStarRating();
    productStarsRating.comment = val.comment;
    productStarsRating.date = dayjs();
    productStarsRating.user = this.user;
    productStarsRating.product = this.product;
    productStarsRating.stars = val.stars;
    this.productStarRatingService.create(productStarsRating).subscribe(() => {
      this.ratedStars = true;
    });
  }

  onLiked(comment: string): void {
    const productLikeDislike = new ProductLikeDislike();
    productLikeDislike.like = 1;
    productLikeDislike.dislike = 0;
    productLikeDislike.product = this.product;
    productLikeDislike.user = this.user;
    productLikeDislike.date = dayjs();
    productLikeDislike.comment = comment;
    this.productLikeDislikeService.create(productLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

  onDislike(comment: string): void {
    const productLikeDislike = new ProductLikeDislike();
    productLikeDislike.like = 0;
    productLikeDislike.dislike = 1;
    productLikeDislike.product = this.product;
    productLikeDislike.user = this.user;
    productLikeDislike.date = dayjs();
    productLikeDislike.comment = comment;
    this.productLikeDislikeService.create(productLikeDislike).subscribe(() => {
      this.rated = true;
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
}
