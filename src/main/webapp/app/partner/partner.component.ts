import { Component, OnInit } from "@angular/core";
import { IPartner } from "app/entities/partner/partner.model";
import { PartnerService } from "app/entities/partner/service/partner.service";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {
  partners!: IPartner[];

  constructor(private partnerService: PartnerService, private generalService: GeneralService) {}

  ngOnInit() {
    this.generalService.findAllPartnersWhereActiveTrue().subscribe(res => {
      this.partners = res.body!;
    });
  }

  formatAddress(partner: IPartner): string {
    const googleAddressArray = partner.address!.split(',');
    const address = googleAddressArray![0];
    const place = googleAddressArray![1];
    const land = googleAddressArray![2];
    const fa = (address + '\n' + place + '\n' + land).trim();
    return fa;
  }
}
