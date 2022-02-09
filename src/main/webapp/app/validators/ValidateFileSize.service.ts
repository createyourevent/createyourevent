import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { JhiDataUtils } from 'ng-jhipster';

@Injectable({
  providedIn: 'root'
})
export class ValidateFileSizeService{

constructor(protected dataUtils: JhiDataUtils) { }


valFileSize(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const val: string = control.value;
      if(val) {
        let bs = this.dataUtils.byteSize(val);
        bs = bs.replace(/\s/g, "");
        bs = bs.slice(0, -5);
        if (Number(bs) > max) {
          return { 'maxFileSize': true }
        }
      }
      return null;
    }
  }
}
