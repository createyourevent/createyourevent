import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ICreateYourEventService } from "app/entities/create-your-event-service/create-your-event-service.model";
import { CreateYourEventServiceService } from "app/entities/create-your-event-service/service/create-your-event-service.service";
import { IServiceComment } from "app/entities/service-comment/service-comment.model";
import { ServiceCommentService } from "app/entities/service-comment/service/service-comment.service";
import { ServiceLikeDislikeService } from "app/entities/service-like-dislike/service/service-like-dislike.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-admin-dashboard-service',
  templateUrl: './admin-dashboard-service.component.html',
  styleUrls: ['admin-dashboard-service.component.scss']
})
export class DashboardServiceComponent {
  serviceId!: number;
  service!: ICreateYourEventService;
  user!: IUser;
  comments: any[] = [];
  commentsServiceComment!: ICreateYourEventService[];
  likes: any[] = [];
  dislikes: any[] = [];
  stars: any[] = [];

  constructor(
    private createYourEventServiceService: CreateYourEventServiceService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private serviceCommentService: ServiceCommentService,
    private serviceLikeDislikeService: ServiceLikeDislikeService
  ) {
    this.route.params.subscribe(params => {
      this.serviceId = params['serviceId'];
      this.createYourEventServiceService.find(this.serviceId).subscribe(s => {
        this.service = s.body!;
        this.generalService.findServiceCommentByServiceId(this.service.id!).subscribe(res => {
          res.body?.forEach(element => {
            this.comments.push(element);
          });
        });
        this.generalService.findServiceLikeDislikeByServiceId(this.service.id!).subscribe(res => {
          res.body!.forEach(element => {
            if (element.like === 1) {
              this.likes.push(element);
            }
            if (element.dislike === 1) {
              this.dislikes.push(element);
            }
          });
        });
        this.generalService.findServiceStarRatingsByServiceId(this.service.id!).subscribe(res => {
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
    this.serviceCommentService.delete(id).subscribe(() => {
      this.comments.forEach((ele: IServiceComment) => {
        const z = ele.serviceComments.findIndex(e => e.id === id);
        if(z > -1) {
          ele.serviceComments.splice(z, 1);
        }
      });
    });
  }

  onDeleteDislikes(id: number): void {
    this.serviceLikeDislikeService.delete(id).subscribe();
  }

  onDeleteLikes(id: number): void {
    this.serviceLikeDislikeService.delete(id).subscribe();
  }
}
