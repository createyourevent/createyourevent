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
import { SlotListClockService } from 'app/entities/slot-list-clock/service/slot-list-clock.service';
import { SlotListCherryService } from 'app/entities/slot-list-cherry/service/slot-list-cherry.service';
import { SlotListOrangeService } from 'app/entities/slot-list-orange/service/slot-list-orange.service';
import { SlotListPlumService } from 'app/entities/slot-list-plum/service/slot-list-plum.service';
import { CouponService } from 'app/entities/coupon/service/coupon.service';
import { ICoupon } from 'app/entities/coupon/coupon.model';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-slot-machine',
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.scss'],
  providers: [MessageService],
})
export class SlotMachineComponent implements OnInit {
  clockCoupon: ICoupon;
  cherryCoupon: ICoupon;
  orangeCoupon: ICoupon;
  plumCoupon: ICoupon;

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

  constructor(
    private generalService: GeneralService,
    private pointsDataService: PointsDataService,
    private ref: ChangeDetectorRef,
    private slotListClockService: SlotListClockService,
    private slotListOrangeService: SlotListOrangeService,
    private slotListCherryService: SlotListCherryService,
    private slotListPlumService: SlotListPlumService,
    private couponService: CouponService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.generalService.findWidthAuthorities().subscribe(us => {
      this.user = us.body!;
      if (this.user !== null) {
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

            this.couponService.query().subscribe(res => {
              const coupons = res.body;

              this.slotListClockService.query().subscribe(res => {
                const clocksString = res.body;
                const clocks = clocksString[0].coupons.split(',').slice(0, -1);
                this.clockCoupon = coupons.find(c => Number(clocks[0]) === c.id);
              });

              this.slotListCherryService.query().subscribe(res => {
                const cherriesString = res.body;
                const cherries = cherriesString[0].coupons.split(',').slice(0, -1);
                this.cherryCoupon = coupons.find(c => Number(cherries[0]) === c.id);
              });

              this.slotListOrangeService.query().subscribe(res => {
                const orangesString = res.body;
                const oranges = orangesString[0].coupons.split(',').slice(0, -1);
                this.orangeCoupon = coupons.find(c => Number(oranges[0]) === c.id);
              });

              this.slotListPlumService.query().subscribe(res => {
                const plumsString = res.body;
                const plums = plumsString[0].coupons.split(',').slice(0, -1);
                this.plumCoupon = coupons.find(c => Number(plums[0]) === c.id);
              });
            });
            this.couponService.query().subscribe(res => {
              const coupons = res.body;

              this.slotListClockService.query().subscribe(res => {
                const clocksString = res.body;
                const clocks = clocksString[0].coupons.split(',').slice(0, -1);
                this.clockCoupon = coupons.find(c => Number(clocks[0]) === c.id);
              });

              this.slotListCherryService.query().subscribe(res => {
                const cherriesString = res.body;
                const cherries = cherriesString[0].coupons.split(',').slice(0, -1);
                this.cherryCoupon = coupons.find(c => Number(cherries[0]) === c.id);
              });

              this.slotListOrangeService.query().subscribe(res => {
                const orangesString = res.body;
                const oranges = orangesString[0].coupons.split(',').slice(0, -1);
                this.orangeCoupon = coupons.find(c => Number(oranges[0]) === c.id);
              });

              this.slotListPlumService.query().subscribe(res => {
                const plumsString = res.body;
                const plums = plumsString[0].coupons.split(',').slice(0, -1);
                this.plumCoupon = coupons.find(c => Number(plums[0]) === c.id);
              });
            });
          }
        });
      }
    });
  }

  callback(payLine: any): void {
    if (payLine[0].title === payLine[1].title && payLine[0].title === payLine[2].title && payLine[1].title === payLine[2].title) {
      timer(4500).subscribe(() => {
        if (payLine[0].title === 'bell') {
          this.clockWin();
        }
        if (payLine[0].title === 'cherry') {
          this.cherryWin();
        }
        if (payLine[0].title === 'orange') {
          this.orangeWin();
        }
        if (payLine[0].title === 'plum') {
          this.plumWin();
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

  clockWin() {
    this.slotListClockService.query().subscribe(res => {
      const slc = res.body;
      const arr = slc[0].coupons.split(',');
      const couponId = Number(arr[0]);
      arr.shift();
      let newArr = arr.join();
      this.couponService.find(couponId).subscribe(c => {
        const coupon = c.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          const user = u.body;
          coupon.user = user;
          this.couponService.update(coupon).subscribe(cu => {
            slc[0].coupons = newArr;
            this.slotListClockService.update(slc[0]).subscribe(res => {
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('home.won'),
                detail: this.translate.instant('home.won.info.clock'),
              });
            });
          });
        });
      });
    });
  }

  orangeWin() {
    this.slotListOrangeService.query().subscribe(res => {
      const slc = res.body;
      const arr = slc[0].coupons.split(',');
      const couponId = Number(arr[0]);
      arr.shift();
      let newArr = arr.join();
      this.couponService.find(couponId).subscribe(c => {
        const coupon = c.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          const user = u.body;
          coupon.user = user;
          this.couponService.update(coupon).subscribe(cu => {
            slc[0].coupons = newArr;
            this.slotListOrangeService.update(slc[0]).subscribe(res => {
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('home.won'),
                detail: this.translate.instant('home.won.info.orange'),
              });
            });
          });
        });
      });
    });
  }

  cherryWin() {
    this.slotListCherryService.query().subscribe(res => {
      const slc = res.body;
      const arr = slc[0].coupons.split(',');
      const couponId = Number(arr[0]);
      arr.shift();
      let newArr = arr.join();
      this.couponService.find(couponId).subscribe(c => {
        const coupon = c.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          const user = u.body;
          coupon.user = user;
          this.couponService.update(coupon).subscribe(cu => {
            slc[0].coupons = newArr;
            this.slotListCherryService.update(slc[0]).subscribe(res => {
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('home.won'),
                detail: this.translate.instant('home.won.info.cherry'),
              });
            });
          });
        });
      });
    });
  }

  plumWin() {
    this.slotListPlumService.query().subscribe(res => {
      const slc = res.body;
      const arr = slc[0].coupons.split(',');
      const couponId = Number(arr[0]);
      arr.shift();
      let newArr = arr.join();
      this.couponService.find(couponId).subscribe(c => {
        const coupon = c.body;
        this.generalService.findWidthAuthorities().subscribe(u => {
          const user = u.body;
          coupon.user = user;
          this.couponService.update(coupon).subscribe(cu => {
            slc[0].coupons = newArr;
            this.slotListPlumService.update(slc[0]).subscribe(res => {
              this.messageService.add({
                key: 'myKey1',
                severity: 'error',
                summary: this.translate.instant('home.won'),
                detail: this.translate.instant('home.won.info.plum'),
              });
            });
          });
        });
      });
    });
  }
}
