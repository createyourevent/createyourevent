import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEventDetails, EventDetails } from '../event-details.model';
import { EventDetailsService } from '../service/event-details.service';

@Component({
  selector: 'jhi-event-details-update',
  templateUrl: './event-details-update.component.html',
})
export class EventDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    totalEntranceFee: [],
  });

  constructor(protected eventDetailsService: EventDetailsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventDetails }) => {
      this.updateForm(eventDetails);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventDetails = this.createFromForm();
    if (eventDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.eventDetailsService.update(eventDetails));
    } else {
      this.subscribeToSaveResponse(this.eventDetailsService.create(eventDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventDetails>>): void {
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

  protected updateForm(eventDetails: IEventDetails): void {
    this.editForm.patchValue({
      id: eventDetails.id,
      totalEntranceFee: eventDetails.totalEntranceFee,
    });
  }

  protected createFromForm(): IEventDetails {
    return {
      ...new EventDetails(),
      id: this.editForm.get(['id'])!.value,
      totalEntranceFee: this.editForm.get(['totalEntranceFee'])!.value,
    };
  }
}
