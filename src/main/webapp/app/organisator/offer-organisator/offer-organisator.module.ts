import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferOrganisatorComponent } from './offer-organisator.component';
import { RouterModule } from '@angular/router';
import { OFFER_ROUTE } from './offer-organisator.route';
import { OfferModule } from 'app/views/offer/offer.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [SharedModule, CommonModule, RouterModule.forChild([OFFER_ROUTE]), OfferModule],
  declarations: [OfferOrganisatorComponent]
})
export class OfferOrganisatorModule {}
