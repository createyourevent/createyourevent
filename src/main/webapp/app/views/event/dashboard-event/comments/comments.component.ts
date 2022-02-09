import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IEventComment } from "app/entities/event-comment/event-comment.model";
import { EventCommentService } from "app/entities/event-comment/service/event-comment.service";
import { IEvent } from "app/entities/event/event.model";
import { EventService } from "app/entities/event/service/event.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  eventId!: number;
  jhiEvent!: IEvent;
  user!: IUser;
  likes: any[] = [];
  dislikes: any[] = [];
  comments: any[] = [];
  commentsProductComment!: IEventComment[];

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private eventCommentService: EventCommentService,
  ) {}


  ngOnInit(): void {
    this.route.parent!.params.subscribe(params => {
      this.eventId = params['eventId'];

      this.eventService.find(this.eventId).subscribe(ev => {
        this.jhiEvent = ev.body!;

        this.generalService.findWidthAuthorities().subscribe(user => {
          this.user = user.body!;

          this.generalService.findEventCommentByEventId(this.jhiEvent.id!).subscribe(res => {
            this.comments = res.body!;
          });
        });
      });
    });
  }

  onDelete(id: number): void {
    this.eventCommentService.delete(id).subscribe(() => {
      this.comments.forEach((ele: IEventComment) => {
        const z = ele.eventComments.findIndex(e => e.id === id);
        if(z > -1) {
          ele.eventComments.splice(z, 1);
        }
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

}
