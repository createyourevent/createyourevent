import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  AfterViewChecked,
  Output,
  EventEmitter,
} from '@angular/core';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import SlotMachine from 'slot-machine-gen';
import { timer } from 'rxjs';
import { PointsDataService } from 'app/points/points-display/points-display.service';

@Component({
  selector: 'jhi-slot-machine',
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotMachineComponent implements OnInit {
  @Output() clockWin = new EventEmitter<any>();
  @Output() cherryWin = new EventEmitter<any>();
  @Output() orangeWin = new EventEmitter<any>();
  @Output() plumWin = new EventEmitter<any>();

  reels = [
    {
      imageSrc: '../../../content/images/slot-machine/reel-strip1.png',
      symbols: [
        {
          title: 'cherry',
          position: 100,
          weight: 2,
        },
        {
          title: 'plum',
          position: 300,
          weight: 6,
        },
        {
          title: 'orange',
          position: 500,
          weight: 5,
        },
        {
          title: 'bell',
          position: 700,
          weight: 1,
        },
        {
          title: 'cherry',
          position: 900,
          weight: 3,
        },
        {
          title: 'plum',
          position: 1100,
          weight: 5,
        },
      ],
    },
    {
      imageSrc: '../../../content/images/slot-machine/reel-strip2.png',
      symbols: [
        {
          title: 'orange',
          position: 100,
          weight: 6,
        },
        {
          title: 'plum',
          position: 300,
          weight: 5,
        },
        {
          title: 'orange',
          position: 500,
          weight: 3,
        },
        {
          title: 'plum',
          position: 700,
          weight: 5,
        },
        {
          title: 'cherry',
          position: 900,
          weight: 2,
        },
        {
          title: 'bell',
          position: 1100,
          weight: 1,
        },
      ],
    },
    {
      imageSrc: '../../../content/images/slot-machine/reel-strip3.png',
      symbols: [
        {
          title: 'cherry',
          position: 100,
          weight: 4,
        },
        {
          title: 'bell',
          position: 300,
          weight: 1,
        },
        {
          title: 'orange',
          position: 500,
          weight: 6,
        },
        {
          title: 'plum',
          position: 700,
          weight: 5,
        },
        {
          title: 'plum',
          position: 900,
          weight: 3,
        },
        {
          title: 'cherry',
          position: 1100,
          weight: 2,
        },
      ],
    },
  ];

  slot: any;
  pointsStart: number;
  user: IUser;
  enoughtPoints = false;
  state = 'new';

  constructor(private generalService: GeneralService, private pointsDataService: PointsDataService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.generalService.findWidthAuthorities().subscribe(us => {
      this.user = us.body!;
      this.generalService.findPropertyByKey('slot_machine_start_points').subscribe(async rt => {
        this.pointsStart = Number(rt.body.value);
        if (this.user.points >= this.pointsStart) {
          this.enoughtPoints = true;
          this.ref.markForCheck();
          while (!document.querySelector('#slot-machine')) {
            await new Promise(r => setTimeout(r, 500));
          }
          var machine = document.getElementById('slot-machine');
          this.slot = new SlotMachine(machine, this.reels, this.callback.bind(this));
        }
      });
    });
  }

  callback(payLine: any): void {
    if (payLine[0].title === payLine[1].title && payLine[0].title === payLine[2].title && payLine[1].title === payLine[2].title) {
      timer(4500).subscribe(() => {
        if (payLine[0].title === 'bell') {
          this.clockWin.emit();
        }
        if (payLine[0].title === 'cherry') {
          this.cherryWin.emit();
        }
        if (payLine[0].title === 'orange') {
          this.orangeWin.emit();
        }
        if (payLine[0].title === 'plum') {
          this.plumWin.emit();
        }
        this.state = 'win';
        this.pointsDataService.changePoint(this.user.points);
        this.generalService.findWidthAuthorities().subscribe(us => {
          this.user = us.body!;
          if (this.user.points - this.pointsStart < 0) {
            this.enoughtPoints = false;
          }
        });
      });
    } else {
      timer(4500).subscribe(() => {
        this.state = 'lost';
        this.pointsDataService.changePoint(this.user.points);
        this.generalService.findWidthAuthorities().subscribe(us => {
          this.user = us.body!;
          if (this.user.points - this.pointsStart < 0) {
            this.enoughtPoints = false;
          }
        });
      });
    }
  }

  play(): void {
    if (this.user.points - this.pointsStart < 0) {
      this.enoughtPoints = false;
      return;
    }
    this.user.points -= this.pointsStart;
    this.generalService.updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points).subscribe(() => {
      this.generalService.updatePointsKeycloak(this.user.points, this.user.id).subscribe(() => {
        this.state = 'new';
        this.slot.play();
      });
    });
  }
}
