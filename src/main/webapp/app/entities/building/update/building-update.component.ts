import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBuilding, Building } from '../building.model';
import { BuildingService } from '../service/building.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

@Component({
  selector: 'jhi-building-update',
  templateUrl: './building-update.component.html',
})
export class BuildingUpdateComponent implements OnInit {
  isSaving = false;

  organizationsCollection: IOrganization[] = [];

  editForm = this.fb.group({
    id: [],
    surface: [],
    organization: [],
  });

  constructor(
    protected buildingService: BuildingService,
    protected organizationService: OrganizationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ building }) => {
      this.updateForm(building);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const building = this.createFromForm();
    if (building.id !== undefined) {
      this.subscribeToSaveResponse(this.buildingService.update(building));
    } else {
      this.subscribeToSaveResponse(this.buildingService.create(building));
    }
  }

  trackOrganizationById(index: number, item: IOrganization): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBuilding>>): void {
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

  protected updateForm(building: IBuilding): void {
    this.editForm.patchValue({
      id: building.id,
      surface: building.surface,
      organization: building.organization,
    });

    this.organizationsCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsCollection,
      building.organization
    );
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query({ filter: 'building-is-null' })
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing(organizations, this.editForm.get('organization')!.value)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsCollection = organizations));
  }

  protected createFromForm(): IBuilding {
    return {
      ...new Building(),
      id: this.editForm.get(['id'])!.value,
      surface: this.editForm.get(['surface'])!.value,
      organization: this.editForm.get(['organization'])!.value,
    };
  }
}
