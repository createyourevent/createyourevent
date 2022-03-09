import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ICoupon } from 'app/entities/coupon/coupon.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { PrimeNGConfig, SelectItem } from 'primeng/api';

@Component({
  selector: 'jhi-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CouponsComponent implements OnInit {
  coupons: ICoupon[] = [];

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  user: IUser;

  constructor(private generalService: GeneralService, private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.sortOptions = [
      { label: 'Value High to Low', value: '!value' },
      { label: 'Value Low to High', value: 'value' },
    ];

    this.primengConfig.ripple = true;
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
    });
    this.generalService.findCouponsByActiveUser().subscribe(res => {
      const coupons = res.body;

      coupons.forEach(el => {
        if (el.used === false || el.used === null) {
          this.coupons.push(el);
        }
      });
      this.coupons = [...this.coupons];
    });
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  getValue(coupon: ICoupon): string {
    return this.user.id + ',,,' + coupon.id + ',,,' + coupon.couponNr + ',,,' + this.user.email;
  }
}
