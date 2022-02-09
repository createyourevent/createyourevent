import { PartnerService } from 'app/entities/partner/service/partner.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { IPartner } from 'app/entities/partner/partner.model';

@Component({
  selector: 'jhi-partner_slider',
  templateUrl: './partner_slider.component.html',
  styleUrls: ['./partner_slider.component.scss']
})
export class PartnerSliderComponent implements OnChanges {
  @Input() partners!: IPartner[];

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  constructor(private parternService: PartnerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partners'] !== undefined) {
      this.partners = changes['partners'].currentValue;
    }
  }

  getVal(id: number): any {
    this.parternService.find(id).subscribe(p => {
      return p.body.webaddress;
    });
  }
}
