import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationType } from 'app/entities/enumerations/organization-type.model';
import { LocationService } from 'app/entities/location/service/location.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { GoogleGeocodeService } from 'app/google-geocode.service';
import { OrganisatorService } from 'app/organisator/organisator.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-organization-data-view',
  templateUrl: './organization-data-view.component.html',
  styleUrls: ['./organization-data-view.component.scss']
})
export class OrganizationDataViewComponent implements OnInit {
  organizations!: IOrganization[];
  sortOrder!: number;
  sortField!: string;
  starEvents: any[] = [];
  loading = false;
  organizationsWithDistance: IOrganization[] = [];
  user: IUser;
  distance: number = 0;
  selectedOrganizationType: OrganizationType;

  organizationTypeValues = Object.keys(OrganizationType);

  config = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select organisation type', // text to be displayed when no item is selected defaults to Select,
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
  }



  constructor(private generalService: GeneralService,
    private organisatorService: OrganisatorService,
    private router: Router,
    private googleGeocoderService: GoogleGeocodeService,
    private locationService: LocationService) { }

    ngOnInit() {
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body;

        this.generalService.findOrganizationsByActiveAndActiveOwner().subscribe(res => {
          this.organizations = res.body!;
          this.organizationsWithDistance = [...this.organizations];
        });
      });
    }

    formatAddress(org: IOrganization): string {
      const googleAddressArray = org.address!.split(',');
      const address = googleAddressArray![0];
      const place = googleAddressArray![1];
      const land = googleAddressArray![2];
      const fa = (address + '\n' + place + '\n' + land).trim();
      return fa;
    }

    changeTypeFilter(e: any): void {
      this.changeSliderRadius(this.distance).then(() => {
        this.organizationsWithDistance = this.organizationsWithDistance.filter(s => s.organizationType === e.value);
      });
    }

    onSortChange(event: any) {
      let value = event.value;

      if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
      } else {
        this.sortOrder = 1;
        this.sortField = value;
      }
    }

    getAverage(eventId: number): number {
      const se = this.starEvents.find(x => x.event.id === eventId);
      return se.average;
    }

    goToOrganization(organization: IOrganization): void {
      if(organization.organizationType === OrganizationType.RESTAURANT) {
        this.router.navigate(['/organization/' + organization.restaurant.id + '/restaurant']);
      } else if(organization.organizationType === OrganizationType.HOTEL) {
        this.router.navigate(['/organization/' + organization.hotel.id + '/hotel']);
      } else if(organization.organizationType === OrganizationType.CLUB) {
        this.router.navigate(['/organization/' + organization.club.id + '/club']);
      }
    }

    changeSliderRadius(e: any): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        if(this.distance === 0) {
          this.organizationsWithDistance = [...this.organizations];
          resolve();
          return;
        }
        this.organizationsWithDistance = [];
        let latUser = 0;
        let lngUser = 0;
        let posUser: google.maps.LatLng;
        const queryParam = this.user.address!.replace(' ', '+');
        this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
          const geocoder = res.body!['results'];
          const geometry = geocoder[0].geometry;
          latUser = geometry.location.lat;
          lngUser = geometry.location.lng;
          posUser = new google.maps.LatLng(latUser, lngUser);
          let i = 0;
          this.organizations.forEach(element => {
            i++;
            this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
              const geocoder = res.body!['results'];
              const geometry = geocoder[0].geometry;
              const lat = geometry.location.lat;
              const lng = geometry.location.lng;

              const posOrganization = new google.maps.LatLng(lat, lng);
              const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posOrganization);
              const maxDistance = Number(this.distance) * 1000;
              if (maxDistance > distance ) {
                if(this.selectedOrganizationType === undefined || this.selectedOrganizationType === null) {
                  this.organizationsWithDistance.push(element);
                } else if (this.selectedOrganizationType === element.organizationType) {
                  this.organizationsWithDistance.push(element);
                }

              }
            });
            if(i === this.organizations.length) {
              this.organizationsWithDistance = [...new Set(this.organizationsWithDistance)];
              resolve();
            }
          });
        });
      });
    }


}
