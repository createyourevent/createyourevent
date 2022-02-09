import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {
  // Name validation
  static addressValidator(control: FormControl): any {
    if (control.value) {
      const matches = control.value.match(/([A-z])+ +\d*, \d* ([A-z])+ ([A-Z])*, ([A-z])*/);
      return matches ? null : { invalidName: true };
    } else {
      return null;
    }
  }
}
