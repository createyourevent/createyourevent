import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationReservation } from '../organization-reservation.model';

@Component({
  selector: 'jhi-organization-reservation-detail',
  templateUrl: './organization-reservation-detail.component.html',
})
export class OrganizationReservationDetailComponent implements OnInit {
  organizationReservation: IOrganizationReservation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationReservation }) => {
      this.organizationReservation = organizationReservation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
