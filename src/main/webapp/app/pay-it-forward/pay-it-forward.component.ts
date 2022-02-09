import { Component, OnInit } from '@angular/core';
import { IFeeTransaction } from 'app/entities/fee-transaction/fee-transaction.model';
import { FeeTransactionService } from 'app/entities/fee-transaction/service/fee-transaction.service';
import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-pay-it-forward',
  templateUrl: './pay-it-forward.component.html',
  styleUrls: ['./pay-it-forward.component.scss']
})
export class PayItForwardComponent implements OnInit {

  payItForwardRate: number = 0;

  totalFees: IFeeTransaction[] = [];
  totalFeesValue = 0;

  constructor(private generalService: GeneralService, private propertyService: PropertyService, private feeTransactionService: FeeTransactionService) { }

  ngOnInit() {
    this.generalService.findPropertyByKey('payitforward_rate').subscribe(rt => {
      this.payItForwardRate = Number(rt.body.value);
      this.feeTransactionService.query().subscribe(res => {
        const ft = res.body;
        ft.forEach(ele => {
          if(ele.date.month() === dayjs().month()) {
            this.totalFeesValue += Number(ele.entries[0].value);
          }
        });
      });
    });
  }

}
