import { Component, ViewChild, OnInit } from '@angular/core';
import { UserPointAssociationService } from 'app/entities/user-point-association/service/user-point-association.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { PointsDataService } from 'app/points/points-display/points-display.service';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';


@Component({
  selector: 'jhi-lucky-spin',
  templateUrl: './luckySpin.component.html',
  styleUrls: ['./luckySpin.component.scss']
})
export class LuckySpinComponent implements OnInit {
  @ViewChild(NgxWheelComponent, { static: false }) wheel: any;


  items: any[] = [];
  numSegments = 8;
  user!: IUser;
  enoughtPoints = false;
  turning = false;
  idToLandOn = 1;
  pointsToTurn = 25;
  textAlignment = TextAlignment.OUTER;
  textOrientation = TextOrientation.CURVED;
  stake = 25;


  minimumPoints_wheeloffortune = 0;
  maximumPoints_wheeloffortune = 0;
  commitmentPoints_wheeloffortune = 0;
  segments_wheeloffortune = 0;


  constructor(private generalService: GeneralService,
              private pointsDataService: PointsDataService) {

  }

  ngOnInit(): void {
    this.generalService.findPropertyByKey('minimumPoints_wheeloffortune').subscribe(rt => {
      this.minimumPoints_wheeloffortune = Number(rt.body!.value);
      this.generalService.findPropertyByKey('maximumPoints_wheeloffortune').subscribe(rw => {
        this.maximumPoints_wheeloffortune = Number(rw.body!.value);
        this.generalService.findPropertyByKey('commitmentPoints_wheeloffortune').subscribe(rq => {
          this.commitmentPoints_wheeloffortune = Number(rq.body!.value);
          this.generalService.findPropertyByKey('segments_wheeloffortune').subscribe(re => {
            this.segments_wheeloffortune = Number(re.body!.value);
            this.numSegments = this.segments_wheeloffortune;
            for (let index = 0; index < this.numSegments; index++) {
              const item =  {'id' : index, 'fillStyle' : this.getRandomColor(), 'text' : '' + this.getRandomInt(this.minimumPoints_wheeloffortune, this.maximumPoints_wheeloffortune)};
              this.items.push(item);
            }
            this.reset();
            this.generalService.findWidthAuthorities().subscribe(us => {
              this.user = us.body!;
              if(this.user.points >= this.pointsToTurn) {
                this.enoughtPoints = true;
              }
            });
          });
        });
      });
    });
  }

  turnWheel(): void {
    this.turning = true;
    this.reset();
    this.user.points -= this.pointsToTurn;
    this.generalService.updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points).subscribe(() => {
      this.spin(this.getRandomInt(0, this.numSegments - 1));
      this.generalService.findWidthAuthorities().subscribe(k => {
        this.pointsDataService.changePoint(k.body!.points);
      });
    });

  }

  async spin(prize: number): Promise<void> {
    this.idToLandOn = prize;
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait here for one tick
    this.wheel.spin();
  }

  reset(): void{
    this.wheel.reset();
  }

  before(): void {
    console.log("BEFOR");
  }

  after(): void {
    this.turning = false;
    this.user.points += Number(this.items[this.idToLandOn].text);
    this.generalService
    .updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points)
    .subscribe(t => {
      this.generalService.findWidthAuthorities().subscribe(k => {
        this.pointsDataService.changePoint(k.body!.points);
        if(k.body!.points < this.commitmentPoints_wheeloffortune) {
          this.enoughtPoints = false;
        }
      });
    });
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomColor(): string {
    const c = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    return c;
  }

}
