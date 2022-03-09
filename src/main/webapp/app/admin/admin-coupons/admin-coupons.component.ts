import { Component, OnInit } from '@angular/core';
import { Coupon, ICoupon } from 'app/entities/coupon/coupon.model';
import { CouponService } from 'app/entities/coupon/service/coupon.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-admin-coupons',
  templateUrl: './admin-coupons.component.html',
  styleUrls: ['./admin-coupons.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class AdminCouponsComponent implements OnInit {
  couponDialog: boolean;

  coupons: ICoupon[];

  coupon: ICoupon;

  selectedCoupons: ICoupon[];

  submitted: boolean;

  statuses: any[];

  constructor(
    private couponService: CouponService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.couponService.query().subscribe(res => {
      this.coupons = res.body;
    });
  }

  openNew() {
    this.coupon = {};
    this.submitted = false;
    this.couponDialog = true;
  }

  deleteSelectedCoupons() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected coupons?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.coupons = this.coupons.filter(val => !this.selectedCoupons.includes(val));
        this.selectedCoupons = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      },
    });
  }

  editCoupon(coupon: ICoupon) {
    this.coupon = { ...coupon };
    this.couponDialog = true;
  }

  deleteCoupon(coupon: ICoupon) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + coupon.title + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.coupons = this.coupons.filter(val => val.id !== coupon.id);
        this.couponService.delete(coupon.id).subscribe(() => {
          this.coupon = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        });
      },
    });
  }

  hideDialog() {
    this.couponDialog = false;
    this.submitted = false;
  }

  saveCoupon() {
    this.submitted = true;

    if (this.coupon.title.trim()) {
      if (this.coupon.id) {
        this.coupons[this.findIndexById(this.coupon.id)] = this.coupon;
        this.couponService.update(this.coupon).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Updated', life: 3000 });
        });
      } else {
        this.coupon.couponNr = this.createCouponNr();
        this.coupon.used = false;
        this.coupons.push(this.coupon);
        this.couponService.create(this.coupon).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Created', life: 3000 });
        });
      }

      this.coupons = [...this.coupons];
      this.couponDialog = false;
      this.coupon = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.coupons.length; i++) {
      if (this.coupons[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createCouponNr(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 20; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
