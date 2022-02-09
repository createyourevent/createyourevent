import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ClubService } from "app/entities/club/service/club.service";
import { CreateYourEventServiceService } from "app/entities/create-your-event-service/service/create-your-event-service.service";
import { HotelService } from "app/entities/hotel/service/hotel.service";
import { OrganizationCommentService } from "app/entities/organization-comment/service/organization-comment.service";
import { OrganizationLikeDislikeService } from "app/entities/organization-like-dislike/service/organization-like-dislike.service";
import { IOrganization } from "app/entities/organization/organization.model";
import { OrganizationService } from "app/entities/organization/service/organization.service";
import { RestaurantService } from "app/entities/restaurant/service/restaurant.service";
import { IServiceComment } from "app/entities/service-comment/service-comment.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-admin-dashboard-organization',
  templateUrl: './admin-dashboard-organization.component.html',
  styleUrls: ['admin-dashboard-organization.component.scss']
})
export class DashboardOrganizationComponent {
  organizationId!: number;
  organization!: IOrganization;
  user!: IUser;
  comments: any[] = [];
  commentsServiceComment!: IOrganization[];
  likes: any[] = [];
  dislikes: any[] = [];
  stars: any[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private clubService: ClubService,
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private organizationCommentService: OrganizationCommentService,
    private organizationLikeDislikeService: OrganizationLikeDislikeService
  ) {
    this.route.params.subscribe(params => {
      this.organizationId = params['organizationId'];

      const url = window.location.href;

      if(url.includes("club")) {
        this.clubService.find(this.organizationId).subscribe(s => {
          this.organization = s.body.organization;
          this.generalService.findOrganizationCommentByOrganizationId(this.organization.id!).subscribe(res => {
            res.body?.forEach(element => {
              this.comments.push(element);
            });
          });
          this.generalService.findOrganizationLikeDislikeByOrganizationId(this.organization.id!).subscribe(res => {
            res.body!.forEach(element => {
              if (element.like === 1) {
                this.likes.push(element);
              }
              if (element.dislike === 1) {
                this.dislikes.push(element);
              }
            });
          });
          this.generalService.findOrganizationStarRatingsByOrganizationId(this.organization.id!).subscribe(res => {
            res.body!.forEach(element => {
              this.stars.push(element);
            })
          });
        });
      }
      if(url.includes("hotel")) {
        this.hotelService.find(this.organizationId).subscribe(s => {
          this.organization = s.body.organization;
          this.generalService.findOrganizationCommentByOrganizationId(this.organization.id!).subscribe(res => {
            res.body?.forEach(element => {
              this.comments.push(element);
            });
          });
          this.generalService.findOrganizationLikeDislikeByOrganizationId(this.organization.id!).subscribe(res => {
            res.body!.forEach(element => {
              if (element.like === 1) {
                this.likes.push(element);
              }
              if (element.dislike === 1) {
                this.dislikes.push(element);
              }
            });
          });
          this.generalService.findOrganizationStarRatingsByOrganizationId(this.organization.id!).subscribe(res => {
            res.body!.forEach(element => {
              this.stars.push(element);
            })
          });
        });
      }
      if(url.includes("restaurant")) {
        this.restaurantService.find(this.organizationId).subscribe(s => {
          this.organization = s.body.organization;
          this.generalService.findOrganizationCommentByOrganizationId(this.organization.id!).subscribe(res => {
            res.body?.forEach(element => {
              this.comments.push(element);
            });
          });
          this.generalService.findOrganizationLikeDislikeByOrganizationId(this.organization.id!).subscribe(res => {
            res.body!.forEach(element => {
              if (element.like === 1) {
                this.likes.push(element);
              }
              if (element.dislike === 1) {
                this.dislikes.push(element);
              }
            });
          });
          this.generalService.findOrganizationStarRatingsByOrganizationId(this.organization.id!).subscribe(res => {
            res.body!.forEach(element => {
              this.stars.push(element);
            })
          });
        });
      }



    });
    this.generalService.findWidthAuthorities().subscribe(res => {
      this.user = res.body!;
    });
  }

  previousState(): void {
    window.history.back();
  }

  onDelete(id: number): void {
    this.organizationCommentService.delete(id).subscribe(() => {
      this.comments.forEach((ele: IServiceComment) => {
        const z = ele.serviceComments.findIndex(e => e.id === id);
        if(z > -1) {
          ele.serviceComments.splice(z, 1);
        }
      });
    });
  }

  onDeleteDislikes(id: number): void {
    this.organizationLikeDislikeService.delete(id).subscribe();
  }

  onDeleteLikes(id: number): void {
    this.organizationLikeDislikeService.delete(id).subscribe();
  }
}
