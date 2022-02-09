import { Component, OnInit } from "@angular/core";
import { IAdminFeesPrice, AdminFeesPrice } from "app/entities/admin-fees-price/admin-fees-price.model";
import { AdminFeesPriceService } from "app/entities/admin-fees-price/service/admin-fees-price.service";


declare const google: any;

@Component({
  selector: 'jhi-admin-fees',
  templateUrl: './admin_fees.component.html',
  styleUrls: ['./admin_fees.component.scss']
})
export class AdminFeesComponent implements OnInit {

 feesOrganisator = 0;
 feesSupplier = 0;
 feesService = 0;
 feesOrganization = 0;
 fees: IAdminFeesPrice = new AdminFeesPrice();


  constructor(
    private adminFeesPriceService: AdminFeesPriceService
  ) {}

  ngOnInit(): void {
    this.adminFeesPriceService.find(1).subscribe(res => {
      this.fees = res.body!;
      this.feesOrganisator = this.fees.feesOrganisator!;
      this.feesSupplier = this.fees.feesSupplier!;
      this.feesService = this.fees.feesService!;
      this.feesOrganization = this.fees.feesOrganizations;
    });
  }

  save(): void {
    this.fees.feesOrganisator = this.feesOrganisator;
    this.fees.feesSupplier = this.feesSupplier;
    this.fees.feesService = this.feesService;
    this.fees.feesOrganizations = this.feesOrganization;
    if(this.fees.id === undefined ) {
      this.adminFeesPriceService.create(this.fees).subscribe(n => {
        const ne = n.body!;
        this.fees = ne;
      });
    }else {
      this.adminFeesPriceService.update(this.fees).subscribe();
    }
  }

  previousState(): void {
    window.history.back();
  }
}
