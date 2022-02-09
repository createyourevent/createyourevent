import { Component, OnInit } from '@angular/core';
import { IClub } from 'app/entities/club/club.model';
import { IHotel } from 'app/entities/hotel/hotel.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  restaurants: IRestaurant[];
  hotels: IHotel[];
  clubs: IClub[];

  isLoading = false;

  constructor(private generalService: GeneralService) { }

  ngOnInit() {
    this.isLoading = true;
    this.generalService.findRestaurantsByUserAndActive().subscribe(res => {
      this.restaurants = res.body;
      this.generalService.findHotelsByUserAndActive().subscribe(hot => {
        this.hotels = hot.body;
        this.generalService.findClubsByUserAndActive().subscribe(club => {
          this.clubs = club.body;
          this.isLoading = false;
        });
      });
    });
  }

  loadPage(): void {
    this.isLoading = true;
    this.generalService.findRestaurantsByUserAndActive().subscribe(res => {
      this.restaurants = res.body;
      this.generalService.findHotelsByUserAndActive().subscribe(hot => {
        this.hotels = hot.body;
        this.generalService.findClubsByUserAndActive().subscribe(club => {
          this.clubs = club.body;
          this.isLoading = false;
        });
      });
    });
  }

}
