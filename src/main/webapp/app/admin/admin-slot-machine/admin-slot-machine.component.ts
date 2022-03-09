import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ICoupon } from 'app/entities/coupon/coupon.model';
import { CouponService } from 'app/entities/coupon/service/coupon.service';
import { PropertyService } from 'app/entities/property/service/property.service';
import { SlotListCherryService } from 'app/entities/slot-list-cherry/service/slot-list-cherry.service';
import { SlotListCherry } from 'app/entities/slot-list-cherry/slot-list-cherry.model';
import { SlotListClockService } from 'app/entities/slot-list-clock/service/slot-list-clock.service';
import { SlotListClock } from 'app/entities/slot-list-clock/slot-list-clock.model';
import { SlotListOrangeService } from 'app/entities/slot-list-orange/service/slot-list-orange.service';
import { SlotListOrange } from 'app/entities/slot-list-orange/slot-list-orange.model';
import { SlotListPlumService } from 'app/entities/slot-list-plum/service/slot-list-plum.service';
import { SlotListPlum } from 'app/entities/slot-list-plum/slot-list-plum.model';
import { GeneralService } from 'app/general.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'jhi-admin-slot-machine',
  templateUrl: './admin-slot-machine.component.html',
  styleUrls: ['./admin-slot-machine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSlotMachineComponent implements OnInit {
  slotmachinePoints: number;

  coupons: ICoupon[] = [];
  clockList: ICoupon[] = [];
  cherryList: ICoupon[] = [];
  orangeList: ICoupon[] = [];
  plumList: ICoupon[] = [];

  constructor(
    private generalService: GeneralService,
    private propertyService: PropertyService,
    private couponService: CouponService,
    private cd: ChangeDetectorRef,
    private slotListClockService: SlotListClockService,
    private slotListCherryService: SlotListCherryService,
    private slotListOrangeService: SlotListOrangeService,
    private slotListPlumService: SlotListPlumService
  ) {}

  ngOnInit() {
    this.generalService.findPropertyByKey('slot_machine_start_points').subscribe(async rt => {
      this.slotmachinePoints = Number(rt.body.value);
      this.cd.markForCheck();
      this.cd.detectChanges();
    });

    this.couponService.query().subscribe(res => {
      this.coupons = res.body;

      forkJoin({
        requestOne: this.loadCloack(),
        requestTwo: this.loadCherry(),
        requestThree: this.loadOrange(),
        requestFour: this.loadPlum(),
      }).subscribe(({ requestOne, requestTwo, requestThree, requestFour }) => {
        requestOne;
        requestTwo;
        requestThree;
        requestFour;
        this.coupons = this.coupons.filter(o1 => !this.cherryList.some(o2 => o1.id === o2.id));
        this.coupons = this.coupons.filter(o1 => !this.orangeList.some(o2 => o1.id === o2.id));
        this.coupons = this.coupons.filter(o1 => !this.plumList.some(o2 => o1.id === o2.id));
        this.coupons = this.coupons.filter(o1 => !this.clockList.some(o2 => o1.id === o2.id));
        this.cd.markForCheck();
        this.cd.detectChanges();
      });
    });
  }

  loadCloack(): Promise<ICoupon[]> {
    return new Promise((resolve, reject) => {
      this.slotListClockService.query().subscribe(res => {
        const slc = res.body;
        if (slc === null || slc.length === 0 || slc[0].coupons === '') {
          resolve([]);
        }
        let coupons = slc[0].coupons.split(',');
        coupons = coupons.slice(0, -1);
        const couponsId = [];
        coupons.forEach(el => {
          couponsId.push(Number(el));
        });
        this.clockList = this.coupons.filter(o1 => couponsId.find(o2 => o1.id === o2));
        resolve(this.clockList);
      });
    });
  }

  loadOrange(): Promise<ICoupon[]> {
    return new Promise((resolve, reject) => {
      this.slotListOrangeService.query().subscribe(res => {
        const slc = res.body;
        if (slc === null || slc.length === 0 || slc[0].coupons === '') {
          resolve([]);
        }
        let coupons = slc[0].coupons.split(',');
        coupons = coupons.slice(0, -1);
        const couponsId = [];
        coupons.forEach(el => {
          couponsId.push(Number(el));
        });
        this.orangeList = this.coupons.filter(o1 => couponsId.find(o2 => o1.id === o2));
        resolve(this.orangeList);
      });
    });
  }

  loadCherry(): Promise<ICoupon[]> {
    return new Promise((resolve, reject) => {
      this.slotListCherryService.query().subscribe(res => {
        const slc = res.body;
        if (slc === null || slc.length === 0 || slc[0].coupons === '') {
          resolve([]);
        }
        let coupons = slc[0].coupons.split(',');
        coupons = coupons.slice(0, -1);
        const couponsId = [];
        coupons.forEach(el => {
          couponsId.push(Number(el));
        });
        this.cherryList = this.coupons.filter(o1 => couponsId.find(o2 => o1.id === o2));
        resolve(this.cherryList);
      });
    });
  }

  loadPlum(): Promise<ICoupon[]> {
    return new Promise((resolve, reject) => {
      this.slotListPlumService.query().subscribe(res => {
        const slc = res.body;
        if (slc === null || slc.length === 0 || slc[0].coupons === '') {
          resolve([]);
        }
        let coupons = slc[0].coupons.split(',');
        coupons = coupons.slice(0, -1);
        const couponsId = [];
        coupons.forEach(el => {
          couponsId.push(Number(el));
        });
        this.plumList = this.coupons.filter(o1 => couponsId.find(o2 => o1.id === o2));
        resolve(this.plumList);
      });
    });
  }

  savePointsToPlay() {
    this.generalService.findPropertyByKey('slot_machine_start_points').subscribe(async rt => {
      const prop = rt.body;
      prop.value = this.slotmachinePoints + '';
      this.propertyService.update(prop).subscribe();
    });
  }

  moveItem(e: any) {
    this.coupons = [...this.coupons];
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  saveLists() {
    const slotListClock = new SlotListClock();
    const slotListCherry = new SlotListCherry();
    const slotListOrange = new SlotListOrange();
    const slotListPlum = new SlotListPlum();

    let clock = '';
    this.clockList.forEach(el => {
      clock = clock + el.id + ',';
    });
    slotListClock.coupons = clock;

    let cherry = '';
    this.cherryList.forEach(el => {
      cherry = cherry + el.id + ',';
    });
    slotListCherry.coupons = cherry;

    let orange = '';
    this.orangeList.forEach(el => {
      orange = orange + el.id + ',';
    });
    slotListOrange.coupons = orange;

    let plum = '';
    this.plumList.forEach(el => {
      plum = plum + el.id + ',';
    });
    slotListPlum.coupons = plum;

    this.generalService.deleteAllSlotListClock().subscribe(() => {
      this.slotListClockService.create(slotListClock).subscribe();
    });
    this.generalService.deleteAllSlotListCherry().subscribe(() => {
      this.slotListCherryService.create(slotListCherry).subscribe();
    });
    this.generalService.deleteAllSlotListOrange().subscribe(() => {
      this.slotListOrangeService.create(slotListOrange).subscribe();
    });
    this.generalService.deleteAllSlotListPlum().subscribe(() => {
      this.slotListPlumService.create(slotListPlum).subscribe();
    });
  }
}
