import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShopCommentService } from "app/entities/shop-comment/service/shop-comment.service";
import { IShopComment } from "app/entities/shop-comment/shop-comment.model";
import { ShopLikeDislikeService } from "app/entities/shop-like-dislike/service/shop-like-dislike.service";
import { ShopService } from "app/entities/shop/service/shop.service";
import { IShop } from "app/entities/shop/shop.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-admin-dashboard-supplier-shop',
  templateUrl: './admin-dashboard-supplier-shop.component.html',
  styleUrls: ['admin-dashboard-supplier-shop.component.scss']
})
export class DashboardSupplierShopComponent {
  shopId!: number;
  shop!: IShop;
  user!: IUser;
  comments: any[] = [];
  commentsShopComment!: IShopComment[];
  likes: any[] = [];
  dislikes: any[] = [];
  stars: any[] = [];

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private shopCommentService: ShopCommentService,
    private shopLikeDislikeService: ShopLikeDislikeService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.shopId = params['shopId'];
      this.shopService.find(this.shopId).subscribe(s => {
        this.shop = s.body!;
        this.generalService.findShopCommentByShopId(this.shop.id!).subscribe(res => {
          this.comments = res.body;
        });
        this.generalService.findShopLikeDislikeByShopId(this.shop.id!).subscribe(res => {
          res.body!.forEach(element => {
            if (element.like === 1) {
              this.likes.push(element);
            }
            if (element.dislike === 1) {
              this.dislikes.push(element);
            }
          });
        });
        this.generalService.findShopStarRatingsByShopId(this.shop.id!).subscribe(res => {
          res.body!.forEach(element => {
            this.stars.push(element);
          })
        });
      });
    });
    this.generalService.findWidthAuthorities().subscribe(res => {
      this.user = res.body!;
    });

  }

  previousState(): void {
    window.history.back();
  }

  onDelete(id: number): void {
    this.shopCommentService.delete(id).subscribe(() => {
      this.comments.forEach((ele: IShopComment) => {
        const z = ele.shopComments.findIndex(e => e.id === id);
        if(z > -1) {
          ele.shopComments.splice(z, 1);
        }
      });
    });
  }

  onDeleteDislikes(id: number): void {
    this.shopLikeDislikeService.delete(id).subscribe();
  }

  onDeleteLikes(id: number): void {
    this.shopLikeDislikeService.delete(id).subscribe();
  }
}
