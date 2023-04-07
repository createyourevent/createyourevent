import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

@Component({
  selector: 'jhi-editrow-box',
  templateUrl: './editrow-box.component.html',
  styleUrls: ['./editrow-box.component.scss'],
})
export class EditRowBoxComponent implements OnInit {
  action!: string;
  localData: any;
  missingTranslationHandler = 0;
  worksheetForm!: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditRowBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder
  ) {
    this.localData = { ...data };
  }
  ngOnInit(): void {
    this.createForm();
    if (this.localData.action === 'Update') {
      this.worksheetForm.get(['id'])!.setValue(this.localData.id);
      this.worksheetForm.get(['description'])!.setValue(this.localData.description);
      this.worksheetForm.get(['start'])!.setValue(dayjs(this.localData.start).format(DATE_TIME_FORMAT));
      this.worksheetForm.get(['end'])!.setValue(dayjs(this.localData.end).format(DATE_TIME_FORMAT));
      this.worksheetForm.get(['costHour'])!.setValue(this.localData.costHour);
      this.worksheetForm.get(['total'])!.setValue(this.localData.total);
    }
    if (this.localData.action === 'Delete') {
      this.worksheetForm.get(['id'])!.setValue(this.localData.id);
    }
    this.action = this.localData.action;
  }

  createForm(): void {
    this.worksheetForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      costHour: ['', Validators.required],
      total: [''],
    });
  }

  doAction(): void {
    this.localData.id = this.worksheetForm.get(['id'])!.value;
    this.localData.description = this.worksheetForm.get(['description'])!.value;
    this.localData.start = this.worksheetForm.get(['start'])!.value;
    this.localData.end = this.worksheetForm.get(['end'])!.value;
    this.localData.costHour = this.worksheetForm.get(['costHour'])!.value;
    this.localData.total = this.worksheetForm.get(['total'])!.value;

    this.dialogRef.close({ event: this.action, data: this.localData });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  calcTotal(): void {
    this.worksheetForm
      .get(['total'])!
      .setValue(
        Math.abs(
          dayjs(this.worksheetForm.get(['end'])!.value).diff(dayjs(this.worksheetForm.get(['start'])!.value), 'minutes') *
            (this.worksheetForm.get(['costHour'])!.value / 60)
        )
      );
  }
}
