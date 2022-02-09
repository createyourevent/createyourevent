import { Injectable } from '@angular/core';
import { AbstractControl,  ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorGreaterThenZero{

constructor() { }


checkGreaterThenZero(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const given : number = control.value;
      if(given){
        if(given > 0 ) {
                return null;
        } else {
            return { 'greaterThenZero': true };
        }
      }
      }
    }
  }
