import { Injectable } from '@angular/core';
import { AbstractControl,  ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorSmallerThen{

constructor() { }


checkMaximumPlaces(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const min : number = Number(control.parent.get('minPlacenumber').value);
      const max : number = Number(control.parent.get('placenumber').value);
      if(min && max){
        if(min <= max ) {
                return null;
        } else {
            return { 'biggerThen': true };
        }
      }
      }
    }
  }
