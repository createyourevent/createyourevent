import { Component, OnInit } from "@angular/core";
import { IChips } from "app/entities/chips/chips.model";
import { ChipsService } from "app/entities/chips/service/chips.service";
import { PointService } from "app/entities/point/service/point.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";

@Component({
  selector: 'jhi-chips-overview',
  templateUrl: './chips-overview.component.html',
  styleUrls: ['./chips-overview.component.scss']
})
export class ChipsOverviewComponent implements OnInit {


  user: IUser;
  foundedChips: IChips[] = [];
  allChips: IChips[] = [];
  totalPoints = 0;
  totalCoins = 0;

  constructor(private generalService: GeneralService, private pointService: PointService, private chipsService: ChipsService) { }

  ngOnInit(): void {
    this.chipsService.query().subscribe(cs => {
      this.allChips = cs.body;
      cs.body.forEach(c => {
        this.totalPoints += c.points;
      });
      this.totalCoins = this.allChips.length;
    });
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.generalService.findChipsCollectionByUserId(this.user.id).subscribe(col => {
        this.generalService.findAllChipsCollectionChipsByChipsCollectionId(col.body.id).subscribe(ccc => {
          ccc.body.forEach(element => {
            this.foundedChips.push(element.chips);
          });
        });
      });
    });
  }

  getRandomColor(): string {
    const c = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    return c;
  }

}
