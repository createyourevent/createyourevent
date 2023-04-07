import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IAddress, Address } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { LocationService } from 'app/entities/location/service/location.service';
import { GoogleGeocodeService } from 'app/google-geocode.service';
import { Observable } from 'rxjs';
import { EventService } from './event.service';

@Component({
  selector: 'jhi-address-update',
  templateUrl: './address-update.component.html',
})
export class AddressUpdateComponent implements OnInit {
  isSaving = false;
  address!: IAddress;
  formattedaddress = '';
  lat!: number;
  lng!: number;
  geocoder!: google.maps.GeocoderResult;

  editForm = this.fb.group({
    id: [],
    address: [],
    lat: [],
    lng: [],
  });

  constructor(
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private eventUserService: EventService,
    private route: ActivatedRoute,
    private addressService: AddressService,
    private googleGeocoderService: GoogleGeocodeService
  ) {}

  ngOnInit(): void {
    let locationId = 0;
    this.route.params.subscribe(params => {
      locationId = params['locationId'];

      this.eventUserService.findAddressByLocationId(locationId).subscribe(address => {
        this.address = address.body!;

        this.updateForm();
      });
    });
  }

  updateForm(): void {
    this.editForm.patchValue({
      id: this.address.id,
      address: this.address.address,
      lat: this.address.lat,
      lng: this.address.lng,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const address = this.createFromForm();
    if (address.id !== undefined) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  private createFromForm(): IAddress {
    console.log(this.editForm.get(['address'])!.value);
    return {
      ...new Address(),
      id: this.editForm.get(['id'])!.value,
      address: this.formattedaddress,
      lat: this.lat,
      lng: this.lng,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddress>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  public addressChange(address: any): void {
    this.formattedaddress = address.formatted_address;
    const queryParam = this.formattedaddress.replace(' ', '+');
    this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
      this.geocoder = res.body!['results'];
      const geometry = this.geocoder['geometry'];
      this.lat = geometry.location.lat();
      this.lng = geometry.location.lng();
    });
  }
}
