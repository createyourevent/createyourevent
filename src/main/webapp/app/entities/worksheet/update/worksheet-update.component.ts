import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IWorksheet, Worksheet } from '../worksheet.model';
import { WorksheetService } from '../service/worksheet.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { WorksheetType } from 'app/entities/enumerations/worksheet-type.model';
import { UserType } from 'app/entities/enumerations/user-type.model';

@Component({
  selector: 'jhi-worksheet-update',
  templateUrl: './worksheet-update.component.html',
})
export class WorksheetUpdateComponent implements OnInit {
  isSaving = false;
  worksheetTypeValues = Object.keys(WorksheetType);
  userTypeValues = Object.keys(UserType);

  usersSharedCollection: IUser[] = [];
  eventsSharedCollection: IEvent[] = [];
  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.required]],
    start: [null, [Validators.required]],
    end: [null, [Validators.required]],
    costHour: [null, [Validators.required]],
    total: [null, [Validators.required]],
    billingType: [],
    userType: [],
    user: [],
    event: [],
    product: [],
  });

  constructor(
    protected worksheetService: WorksheetService,
    protected userService: UserService,
    protected eventService: EventService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ worksheet }) => {
      if (worksheet.id === undefined) {
        const today = dayjs().startOf('day');
        worksheet.start = today;
        worksheet.end = today;
      }

      this.updateForm(worksheet);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const worksheet = this.createFromForm();
    if (worksheet.id !== undefined) {
      this.subscribeToSaveResponse(this.worksheetService.update(worksheet));
    } else {
      this.subscribeToSaveResponse(this.worksheetService.create(worksheet));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorksheet>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(worksheet: IWorksheet): void {
    this.editForm.patchValue({
      id: worksheet.id,
      description: worksheet.description,
      start: worksheet.start ? worksheet.start.format(DATE_TIME_FORMAT) : null,
      end: worksheet.end ? worksheet.end.format(DATE_TIME_FORMAT) : null,
      costHour: worksheet.costHour,
      total: worksheet.total,
      billingType: worksheet.billingType,
      userType: worksheet.userType,
      user: worksheet.user,
      event: worksheet.event,
      product: worksheet.product,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, worksheet.user);
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, worksheet.event);
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, worksheet.product);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): IWorksheet {
    return {
      ...new Worksheet(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      start: this.editForm.get(['start'])!.value ? dayjs(this.editForm.get(['start'])!.value, DATE_TIME_FORMAT) : undefined,
      end: this.editForm.get(['end'])!.value ? dayjs(this.editForm.get(['end'])!.value, DATE_TIME_FORMAT) : undefined,
      costHour: this.editForm.get(['costHour'])!.value,
      total: this.editForm.get(['total'])!.value,
      billingType: this.editForm.get(['billingType'])!.value,
      userType: this.editForm.get(['userType'])!.value,
      user: this.editForm.get(['user'])!.value,
      event: this.editForm.get(['event'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
