import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IContact, Contact } from "app/entities/contact/contact.model";
import { ContactService } from "app/entities/contact/service/contact.service";
import { JhiDataUtils, JhiEventManager } from "ng-jhipster";
import { Observable } from "rxjs";
import * as dayjs from "dayjs";


declare const google: any;

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  isSaving = false;
  dateDp: any;

  options: any;

  overlays!: any[];

  contactForm = this.fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    message: [null, [Validators.required]]
  });

  center!: google.maps.LatLngLiteral;

  markers: any[] = [];

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected contactService: ContactService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });

    this.options = {
      center: { lat: 47.69561, lng: 8.65088 },
      zoom: 12
    };

    this.initOverlays();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contact = this.createFromForm();
    if (contact.id !== undefined) {
      this.subscribeToSaveResponse(this.contactService.update(contact));
    } else {
      this.subscribeToSaveResponse(this.contactService.create(contact));
    }
  }

  private createFromForm(): IContact {
    return {
      ...new Contact(),
      name: this.contactForm.get(['name'])!.value,
      email: this.contactForm.get(['email'])!.value,
      message: this.contactForm.get(['message'])!.value,
      date: dayjs()
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContact>>): void {
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

  initOverlays(): void {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = [
        new google.maps.Marker({
          position: { lat: 47.69561, lng: 8.65088 },
          title: 'Heartfull-Mind SwPL. ',
          label: { color: 'black', text: 'Headquarter' }
        }),
        new google.maps.Marker({
          position: { lat: 47.7233, lng: 8.66429 },
          title: 'Create Your Event',
          label: { color: 'black', text: 'Sub-Unit' }
        })
      ];
    }
  }
}
