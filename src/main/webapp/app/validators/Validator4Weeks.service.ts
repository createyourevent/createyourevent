import { Injectable } from '@angular/core';
import { AbstractControl,  ValidationErrors, ValidatorFn } from '@angular/forms';
import { JhiDataUtils } from 'ng-jhipster';
import * as dayjs from "dayjs";

@Injectable({
  providedIn: 'root'
})
export class Validator4Weeks{

constructor(protected dataUtils: JhiDataUtils) { }


check4weeks(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const now = dayjs();
      const eventDate = dayjs(control.value);
      const weeks4 = now.add(6, 'week');
      if( !eventDate || !eventDate.isValid() || eventDate.isBefore(weeks4)) {
          return { 'not4weeks': true }
        }
        return null;
      }
    }
  }
