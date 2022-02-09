import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IProductComment } from "app/entities/product-comment/product-comment.model";
import { ProductCommentService } from "app/entities/product-comment/service/product-comment.service";
import { ProductLikeDislikeService } from "app/entities/product-like-dislike/service/product-like-dislike.service";
import { IProduct } from "app/entities/product/product.model";
import { ProductService } from "app/entities/product/service/product.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-admin-dashboard-supplier',
  templateUrl: './admin-dashboard-supplier.component.html',
  styleUrls: ['admin-dashboard-supplier.component.scss']
})
export class DashboardSupplierComponent implements OnInit {
  productId!: number;
  product!: IProduct;
  user!: IUser;
  comments: any[] = [];
  commentsProductComment!: IProductComment[];
  likes: any[] = [];
  dislikes: any[] = [];
  stars: any[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private productCommentService: ProductCommentService,
    private productLikeDislikeService: ProductLikeDislikeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['productId'];
      this.productService.find(this.productId).subscribe(p => {
        this.product = p.body!;

        this.generalService.findProductCommentByProductId(this.product.id!).subscribe(res => {
          this.comments = res.body!;
        });
        this.generalService.findProductLikeDislikeByProductId(this.product.id!).subscribe(res => {
          res.body!.forEach(element => {
            if (element.like === 1) {
              this.likes.push(element);
            }
            if (element.dislike === 1) {
              this.dislikes.push(element);
            }
          });
        });
        this.generalService.findProductStarRatingsByProductId(this.product.id!).subscribe(res => {
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

  onDelete(id: number): void {
    this.productCommentService.delete(id).subscribe(() => {
      this.comments.forEach((ele: IProductComment) => {
        const z = ele.productComments.findIndex(e => e.id === id);
        if(z > -1) {
          ele.productComments.splice(z, 1);
        }
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  onDeleteDislikes(id: number): void {
    this.productLikeDislikeService.delete(id).subscribe();
  }

  onDeleteLikes(id: number): void {
    this.productLikeDislikeService.delete(id).subscribe();
  }
}
