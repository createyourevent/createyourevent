import { Component, OnInit } from '@angular/core';
import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-pay-it-forward-admin',
  templateUrl: './pay-it-forward-admin.component.html',
  styleUrls: ['./pay-it-forward-admin.component.scss']
})
export class PayItForwardAdminComponent implements OnInit {

  payItForwardRate: number = 0;

  constructor(private generalService: GeneralService, private propertyService: PropertyService) { }

  ngOnInit() {
    this.generalService.findPropertyByKey('payitforward_rate').subscribe(rt => {
      this.payItForwardRate = Number(rt.body.value);
    });
  }

  save(): void {
    this.generalService.findPropertyByKey('payitforward_rate').subscribe(rt => {
      const iproperty: IProperty = rt.body;
      iproperty.value = this.payItForwardRate + "";
      this.propertyService.update(iproperty).subscribe(res => {

      });
    });

  }

  previousState(): void {
    window.history.back();
  }
}
