import { Component, OnInit, OnChanges, Input, SimpleChanges } from "@angular/core";
import { IEvent } from "app/entities/event/event.model";
import { IImage } from "app/entities/image/image.model";
import { ImageService } from "app/entities/image/service/image.service";
import { UserPointAssociationService } from "app/entities/user-point-association/service/user-point-association.service";
import { UserPointAssociation } from "app/entities/user-point-association/user-point-association.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { PointsDataService } from "app/points/points-display/points-display.service";
import * as dayjs from "dayjs";


@Component({
  selector: 'jhi-admin-gallery-event',
  templateUrl: './admin-gallery-event.component.html',
  styleUrls: ['admin-gallery-event.component.scss']
})
export class AdminGalleryEventComponent implements OnInit, OnChanges {
  @Input() jhiEvent!: IEvent;
  @Input() user!: IUser;
  uploadedFiles: any[] = [];
  images!: IImage[];
  url!: string;
  fileLimit = 10;

  constructor(
    private imageService: ImageService,
    private generalService: GeneralService,
    private pointsDataService: PointsDataService,
    private userPointAssociationService: UserPointAssociationService
  ) {}
  ngOnInit(): void {
    this.url = '/api/upload/' + this.jhiEvent.id + '/' + this.user.id + '/event';
    this.generalService.findImagesByEventId(this.jhiEvent.id!).subscribe(res => {
      this.images = res.body!;
      this.fileLimit = 10 - this.images.length;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jhiEvent'] !== undefined) {
      this.jhiEvent = changes['jhiEvent'].currentValue;
      this.ngOnInit();
    }
    if (changes['user'] !== undefined) {
      this.user = changes['user'].currentValue;
      this.ngOnInit();
    }
  }

  onUpload(e: any): void {
    for (const file of e.files) {
      this.uploadedFiles.push(file);
    }

    this.generalService.findPointsByKey('upload_image_event').subscribe(p => {
      const points = p.body!;
      this.generalService.findUserPointAssociationByUsersIdAndPointkey(this.user.id, points.key!).subscribe(s => {
        const upa = s.body!;
        const day = dayjs().date();
        let i = 0;
        upa.forEach(element => {
          if (element.date!.date() === day) {
            i++;
          }
        });
        if (i < points.countPerDay!) {
          const iupa = new UserPointAssociation();
          iupa.users = this.user;
          iupa.points = points;
          iupa.date = dayjs();
          this.userPointAssociationService.create(iupa).subscribe();
          const img_points = points.points! * this.uploadedFiles.length;
          this.user.points! += img_points;
          this.user.loggedIn = true;
          this.generalService.updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points!).subscribe(t => {
            this.generalService.findWidthAuthorities().subscribe(k => {
              this.pointsDataService.changePoint(k.body!.points!);
            });
          });
        }
      });
    });

    this.generalService.findImagesByEventId(this.jhiEvent.id!).subscribe(res => {
      this.images = res.body!;
      this.fileLimit = 10 - this.images.length;
    });
  }

  deleteImage(imageId: number): void {
    this.imageService.delete(imageId).subscribe(() => {
      this.generalService.findImagesByEventId(this.jhiEvent.id!).subscribe(res => {
        this.images = res.body!;
        this.fileLimit = 10 - this.images.length;
      });
    });
  }
}
