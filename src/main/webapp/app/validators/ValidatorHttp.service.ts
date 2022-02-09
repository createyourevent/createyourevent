import { Injectable } from '@angular/core';
import { AbstractControl,  ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorHttp{

constructor() { }


checkHttp(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const address: string = control.value;
      if(address){
        if(address.startsWith("http://") || address.startsWith("https://")) {
                return null;
        } else {
            return { 'startsWithHttp': true };
        }                                                                                                                                                                                                                                            
      }
      }
    }
  }