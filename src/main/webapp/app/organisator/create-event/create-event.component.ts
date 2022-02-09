import { Validator4Weeks } from './../../validators/Validator4Weeks.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { SharedEventService } from './shared-event.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedLanguageChangeService } from 'app/layouts/navbar/SharedLanguageChangeService.service';
import { Subject, Subscription } from 'rxjs';
import { JhiLanguageService } from 'ng-jhipster';
import { IOrganization } from 'app/entities/organization/organization.model';
import { GeneralService } from 'app/general.service';
import { GoogleGeocodeService } from 'app/google-geocode.service';
import dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { ValidatorMaximumPlaces } from 'app/validators/ValidatorMaximumPlaces.service';
import { ValidatorSmallerThen } from 'app/validators/ValidatorSmallerThen.service';
import { MessageService } from 'primeng/api';
import { ValidatorGreaterThenZero } from 'app/validators/ValidatorGreaterThenZero.service';
import { IOrganizationReservation, OrganizationReservation } from 'app/entities/organization-reservation/organization-reservation.model';
import { RentType } from 'app/entities/enumerations/rent-type.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrganizationReservationCalendarComponent } from './organization-reservation-calendar/organization-reservation-calendar.component';

export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'jhi-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
  providers: [MessageService, DialogService]
})
export class CreateEventComponent implements OnInit, OnDestroy {

  loading = false;
  organizationsWithDistance: IOrganization[] = [];
  user: IUser;
  distance: number;

  model: any = {};

  refresh: Subject<any> = new Subject();

  changeEventsubscription: Subscription;
  activedStep = 0;

  isOrganization = false;

  organizations: IOrganization[] = [];
  organization: IOrganization;
  organizationReservation: IOrganizationReservation;

  steps: StepType[];

  form: FormArray;
  options: any;
  isAdding = false;

  ref: DynamicDialogRef;

  constructor(
    private sharedEventService: SharedEventService,
    private router: Router,
    private translate: TranslateService,
    private sharedLanguageChangeService: SharedLanguageChangeService,
    private languageService: JhiLanguageService,
    private validator4Weeks: Validator4Weeks,
    private generalService: GeneralService,
    private googleGeocoderService: GoogleGeocodeService,
    private validatorSmallerThen: ValidatorSmallerThen,
    private messageService: MessageService,
    private validatorGreaterThenZero: ValidatorGreaterThenZero,
    public dialogService: DialogService
  ) {
    this.changeEventsubscription = this.sharedLanguageChangeService.getChangeEvent().subscribe(() => {
      this.changeLanguage();
    });

    if (this.sharedEventService.sharedEvent != null) {
      this.model = this.sharedEventService.sharedEvent;
    }

  }
  ngOnInit(): void {
    this.steps = [
      {
        label: this.translate.instant('create-event.eventdata'),
        fields: [
          {
            key: 'name',
            type: 'input',
            templateOptions: {
              label: this.translate.instant('create-event.eventname'),
              required: true,
              placeholder: this.translate.instant('create-event.eventname'),
              description: this.translate.instant('create-event.name.description')
            }
          },
          {
            key: 'motto',
            type: 'input',
            templateOptions: {
              label: this.translate.instant('create-event.motto'),
              required: true,
              placeholder: this.translate.instant('create-event.motto'),
              description: this.translate.instant('create-event.motto.description')
            }
          },
          {
            key: 'keywords',
            type: 'keywords',
            templateOptions: {
              label: this.translate.instant('create-event.keywords'),
              required: true,
              placeholder: this.translate.instant('create-event.keywords'),
              description: this.translate.instant('create-event.keywords.description')
            }
          },
          {
            key: 'select_event_category',
            type: 'select',
            templateOptions: {
              label: this.translate.instant('create-event.eventcategory'),
              description: this.translate.instant('create-event.eventcategory.description'),
              required: true,
              multiple: false,
              selectAllOption: this.translate.instant('create-event.select-all'),
              options: [
                { value: 'INDOOR', label: this.translate.instant('create-event.category.indoor') },
                { value: 'OUTDOOR', label: this.translate.instant('create-event.category.outdoor') },
                { value: 'BIRTHDAY', label: this.translate.instant('create-event.category.birthday') },
                { value: 'NATIONAL_HOLYDAY', label: this.translate.instant('create-event.category.national-holiday') },
                { value: 'WEDDING', label: this.translate.instant('create-event.category.wedding') },
                { value: 'GRADUATION', label: this.translate.instant('create-event.category.graduation') },
                { value: 'HALLOWEEN', label: this.translate.instant('create-event.category.halloween') }
              ]
            }
          },
          {
            key: 'date_start',
            type: 'date',
            templateOptions: {
              type: 'date',
              label: this.translate.instant('create-event.event-start-date'),
              required: true,
              placeholder: this.translate.instant('create-event.event-start-date'),
              description: this.translate.instant('create-event.event-start-date.description')
            },
            validators: {
              validation: [this.validator4Weeks.check4weeks()],
            },
          },
          {
            key: 'date_end',
            type: 'date',
            templateOptions: {
              type: 'date',
              label: this.translate.instant('create-event.event-end-date'),
              required: true,
              placeholder: this.translate.instant('create-event.event-end-date'),
              description: this.translate.instant('create-event.event-end-date.description')
            },
            validators: {
              validation: [this.validator4Weeks.check4weeks()],
            },
          },
          {
            key: 'time_start',
            type: 'time',
            templateOptions: {
              type: 'time',
              label: this.translate.instant('create-event.event-start-time'),
              required: true,
              placeholder: this.translate.instant('create-event.event-start-time'),
              description: this.translate.instant('create-event.event-start-time.description')
            }
          },
          {
            key: 'time_end',
            type: 'time',
            templateOptions: {
              type: 'time',
              label: this.translate.instant('create-event.event-end-time'),
              required: true,
              placeholder: this.translate.instant('create-event.event-end-time'),
              description: this.translate.instant('create-event.event-end-time.description')
            }
          },
          {
            key: 'description',
            type: 'quill',
            templateOptions: {
              label: this.translate.instant('create-event.description'),
              required: true,
              placeholder: this.translate.instant('create-event.description'),
              description: this.translate.instant('create-event.description.description'),
              rows: 5
            }
          }
        ],
      },

      {
        label: this.translate.instant('create-event.administrativ-information') ,
        fields: [
          {
            key: 'private_public',
            type: 'cye',
            templateOptions: {
              label: this.translate.instant('create-event.private-public'),
              description: this.translate.instant('create-event.private-public.description'),
              required: true,
              options: [
                { value: this.translate.instant('create-event.private'), key: 'private'},
                { value: this.translate.instant('create-event.public') , key: 'public'}
              ]
            }
          },
          {
            key: 'placenumber',
            type: 'input',
            templateOptions: {
              label: this.translate.instant('create-event.participants'),
              required: true,
              change: this.calcTotal.bind(this),
              placeholder: this.translate.instant('create-event.participants'),
              description: this.translate.instant('create-event.participants.description')
            },
            validators: {
              validation: Validators.compose([this.validatorSmallerThen.checkMaximumPlaces(), this.validatorGreaterThenZero.checkGreaterThenZero()])
            }
            },
            {
            key: 'minPlacenumber',
            type: 'input',
            templateOptions: {
              label: this.translate.instant('create-event.min-participants'),
              required: true,
              change: this.calcTotal.bind(this),
              placeholder: this.translate.instant('create-event.min-participants'),
              description: this.translate.instant('create-event.min-participants.description')
            },
            validators: {
              validation: Validators.compose([this.validatorSmallerThen.checkMaximumPlaces(), this.validatorGreaterThenZero.checkGreaterThenZero()])
            }
          },
          {
            key: 'price',
            type: 'input',
            templateOptions: {
              label: this.translate.instant('create-event.price'),
              required: true,
              placeholder: this.translate.instant('create-event.price'),
              change: this.calcTotal.bind(this),
              description: this.translate.instant('create-event.price.description')
            },
            validators: {
              validation: Validators.compose([this.validatorGreaterThenZero.checkGreaterThenZero()])
            }
          },
          {
            key: 'total',
            type: 'input',
            defaultValue: 0,
            templateOptions: {
              label: this.translate.instant('create-event.total'),
              disabled: true,
              description: this.translate.instant('create-event.total.description')
            }
          },
          {
            key: 'investment',
            type: 'input',
            templateOptions: {
              label: this.translate.instant('create-event.investment'),
              required: true,
              placeholder: this.translate.instant('create-event.investment'),
              description: this.translate.instant('create-event.investment.description')
            }
          }
        ],
      },
      {
        label: this.translate.instant('create-event.location'),
        fields: [
          {
            key: 'name_location',
            type: 'input',
            templateOptions: {
              label: this.translate.instant('create-event.locationname'),
              required: true,
              placeholder: this.translate.instant('create-event.locationname'),
              description: this.translate.instant('create-event.locationname.description')
            }
          },
          {
            key: 'address',
            type: 'address',
            templateOptions: {
              label: this.translate.instant('create-event.address'),
              required: true,
              pattern: /(?:([A-z\\.-ßäöü]+[\sA-z\\.-ßäöü]*[\sA-z\\.-ßäöü]*[\sA-z\\.-ßäöü]*[\s]*[0-9]*)([\s]*[,]?[\s]*)([\d][\d][\d][\d][\d]?[\s]+[A-z\\.-ßäöü]+[\sA-z\\.-ßäöü]*[\sA-z\\.-ßäöü]*[\sA-z\\.-ßäöü]*)([\s]*[,]?[\s]*)([A-z\\.-ßäöü]+[\s]*[A-zß]*[\s]*[A-zß]*)$)/,
              description: this.translate.instant('fieldnames.address.info')
            }
          },
          {
            key: 'description_location',
            type: 'quill',
            templateOptions: {
              label: this.translate.instant('create-event.description-location'),
              required: true,
              placeholder: this.translate.instant('create-event.description-location'),
              description: this.translate.instant('create-event.description-location.description'),
              rows: 5
            }
          }
        ],
      },
    ];

    this.form = new FormArray(this.steps.map(() => new FormGroup({})));
    this.options = this.steps.map(() => <FormlyFormOptions> {});

    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
    });
  }

  showCalendar(organization: IOrganization) {
    this.ref = this.dialogService.open(OrganizationReservationCalendarComponent, {
        header: 'All reservations for this organization',
        width: '90%',
        data: { organization: organization }
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

  changeOrg(e: any) {
    if(!e) {
      //this.form.controls[1].get('placenumber').setValue(0);
      //this.form.controls[1].get('placenumber').clearValidators();
      this.isOrganization = e;
      this.sharedEventService.organization = null;
      this.organization = null;
    } else {
      this.isOrganization = e;
      this.generalService.findOrganizationsByActiveAndActiveOwner().subscribe(org => {
        this.organizations = [];
        const organizations = org.body;
        const pn = this.form.controls[1].get('placenumber').value;
        organizations.forEach(ele => {
          if(ele.placeNumber >=  pn) {
            this.organizations.push(ele);
          }
        });
        this.organizationsWithDistance = this.organizations;
      });
    }
  }

  getPlaceNumber(): number {
    if(this.form) {
      return this.form.controls[1].get('placenumber').value;
    }
  }

  ngOnDestroy(): void {
    this.changeEventsubscription.unsubscribe();

    if (this.ref) {
      this.ref.close();
  }

  }

  changeLanguage(): void {
    this.translate.use(this.languageService.getCurrentLanguage());
    this.refresh.next();
    // window.location.reload();
  }

  calcTotal(): void {
    const total = Number(this.model.price) * Number(this.model.minPlacenumber);
    this.model = {
      ...this.model,
      total: total
    };
  }

  prevStep(step: any): void {
    this.activedStep = step - 1;
  }

  nextStep(step: any): void {
    this.activedStep = step + 1;
  }

  selectOrganization(org: IOrganization): void {
    this.isAdding = true;
    const dateFromField = document.getElementById('field_dateStart-' + org.id) as HTMLInputElement;
    const dateUntilField = document.getElementById('field_dateEnd-' + org.id) as HTMLInputElement;
    const timeFromField = document.getElementById('field_timeStart-' + org.id) as HTMLInputElement;
    const timeUntilField = document.getElementById('field_timeEnd-' + org.id) as HTMLInputElement;

    const dateFrom = dayjs(dateFromField.value + ' ' + timeFromField.value);
    const dateUntil = dayjs(dateUntilField.value + ' ' + timeUntilField.value);

    if (dateFromField.value === '' || timeFromField.value === '' || dateUntilField.value === '' || timeUntilField.value === '' ||  !dateFrom.isValid() || !dateUntil.isValid()) {
      this.isAdding = false;
      this.messageService.add({
        key: 'myKey1',
        severity: 'error',
        summary: this.translate.instant('select-products.error'),
        detail: this.translate.instant('select-products.error-date')
      });
      return;
    }


    this.generalService.findAllOrganizationReservationsWithDateRange(dateFrom, dateUntil).subscribe(smo => {
      const orders = smo.body;
      if (orders!.length > 0) {
        this.isAdding = false;
        this.messageService.add({
          key: 'myKey1',
          severity: 'error',
          summary: this.translate.instant('select-products.error'),
          detail: this.translate.instant('select-services.error_free_space'),
        });
        return;
      }

      const duration = dayjs.duration(dateUntil.diff(dateFrom));
      const hours = duration.asHours();
      let factor = 0;
      let sum = 0;

      if (org.rentType === RentType.HOURLY) {
        factor = hours;
        sum = org.price * factor;
      } else if (org.rentType === RentType.HALFDAY) {
        factor = hours / 12;
        if (hours < 12) {
          factor = 1;
        } else if (hours >= 12 && hours < 24) {
          factor = 2;
        } else if (hours >= 36 && hours < 48) {
          factor = 3;
        } else if (hours >= 60 && hours < 72) {
          factor = 4;
        } else if (hours >= 84 && hours < 96) {
          factor = 5;
        } else if (hours >= 96 && hours < 106) {
          factor = 6;
        } else if (hours >= 106 && hours < 118) {
          factor = 7;
        }
      } else if (org.rentType === RentType.DAY) {
        factor = hours / 24;
        if (hours < 24) {
          factor = 1;
        } else if (hours >= 24 && hours < 48) {
          factor = 2;
        } else if (hours >= 48 && hours < 72) {
          factor = 3;
        } else if (hours >= 72 && hours < 96) {
          factor = 4;
        } else if (hours >= 96 && hours < 120) {
          factor = 5;
        } else if (hours >= 120 && hours < 144) {
          factor = 6;
        } else if (hours >= 144 && hours < 168) {
          factor = 7;
        }
      }
      sum = org.price * factor;
      const totalEntry = Number(this.model.price) * Number(this.model.minPlacenumber);
      const totalInvestment = Number(this.model.investment);

      if (sum > totalEntry + totalInvestment) {
        this.isAdding = false;
        this.messageService.add({
          key: 'myKey1',
          severity: 'error',
          summary: this.translate.instant('create-event.error'),
          detail: this.translate.instant('create-event.organization-too-expensive'),
        });
        return;
      }

      this.organizationReservation = new OrganizationReservation();
      this.organizationReservation.date = dayjs();
      this.organizationReservation.dateFrom = dateFrom;
      this.organizationReservation.dateUntil = dateUntil;
      this.organizationReservation.total = sum;
      this.organizationReservation.organization = org;
      this.sharedEventService.organizationReservation = this.organizationReservation;

      if(this.sharedEventService.organization) {
        this.organizationsWithDistance.push(this.sharedEventService.organization);
      }
      const found  = this.organizationsWithDistance.findIndex(e => e.id === org.id);
      if(found >= 0) {
        this.organizationsWithDistance.splice(found, 1);
      }

      this.sharedEventService.organization = org;
      this.organization = org;
      this.model.organization = org;
      this.model.organizationReservation = this.organizationReservation;
      this.isAdding = false;

    });
  }

  submit(): void {
    this.sharedEventService.sharedEvent = this.model;
    this.router.navigate(['/organisator/create-event/flyer']);
  }

  changeSliderRadius(e: any): void {
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

      const now = dayjs();
      this.organizations.forEach(element => {
        this.googleGeocoderService.getFromAddress(queryParam).subscribe((res: any) => {
          const geocoder = res.body!['results'];
          const geometry = geocoder[0].geometry;
          const lat = geometry.location.lat;
          const lng = geometry.location.lng;

          const posOrganization = new google.maps.LatLng(lat, lng);
          const distance = google.maps.geometry.spherical.computeDistanceBetween(posUser, posOrganization);
          const maxDistance = Number(e) * 1000;
          if(e === 0) {
            this.organizationsWithDistance = this.organizations;
          }
          if (maxDistance > distance) {
            this.organizationsWithDistance.push(element);
          }
        });
      });
      this.organizationsWithDistance = [...new Set(this.organizationsWithDistance)];
    });
  };
}
