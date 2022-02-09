import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubService } from 'app/entities/club/service/club.service';
import { HotelService } from 'app/entities/hotel/service/hotel.service';
import { IOrganizationReservation } from 'app/entities/organization-reservation/organization-reservation.model';
import { OrganizationReservationService } from 'app/entities/organization-reservation/service/organization-reservation.service';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

@Component({
  selector: 'jhi-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.scss']
})
export class RentComponent implements OnInit {

  organizationId: number;
  organizationReservations: IOrganizationReservation[];
  loading: boolean = true;
  saving = false;

  constructor(private route: ActivatedRoute,
              private restaurantService: RestaurantService,
              private clubService: ClubService,
              private hotelService: HotelService,
              private organizationReservationService: OrganizationReservationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.organizationId = params['id'];
      const url = window.location.href;

      if(url.includes("club")) {
        this.clubService.find(this.organizationId).subscribe(c => {
          const club = c.body;
          this.organizationReservations = club.organization.organizationReservations;
          this.loading = false;
        });
      }
      if(url.includes("hotel")) {
        this.hotelService.find(this.organizationId).subscribe(h => {
          const hotel = h.body;
          this.organizationReservations = hotel.organization.organizationReservations;
          this.loading = false;
        });
      }
      if(url.includes("restaurant")){
        this.restaurantService.find(this.organizationId).subscribe(r => {
          const restaurant = r.body;
          this.organizationReservations = restaurant.organization.organizationReservations;
          this.loading = false;
        });
      }
    });
  }

  switchSeen(e: any, id: number) {
    this.organizationReservationService.find(id).subscribe(res => {
      const reservation = res.body;
      reservation.seen = true;
      this.organizationReservationService.update(reservation).subscribe()
    });
  }

  switchApproved(e: any, id: number) {
    this.organizationReservationService.find(id).subscribe(res => {
      const reservation = res.body;
      reservation.approved = true;
      this.organizationReservationService.update(reservation).subscribe()
    });
  }

}
