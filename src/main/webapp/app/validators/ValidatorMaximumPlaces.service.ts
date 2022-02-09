import { Injectable } from '@angular/core';
import { AbstractControl,  ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorMaximumPlaces{

constructor() { }


checkMaximumPlaces(max: number): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const given : number = control.value;
      if(given){
        if(max >= given ) {
                return null;
        } else {
            return { 'maxPlaces': true };
        }
      }
      }
    }
  }
