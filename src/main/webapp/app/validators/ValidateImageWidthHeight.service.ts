import { Injectable } from '@angular/core';
import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidateImageWidthHeightService {
  constructor() {}

  validateProductImageWidthHeight(w: number, h: number): any {
    return (formGroup: UntypedFormGroup) => {
      const imageByte = formGroup.controls.photo.value;
      const imageContentType = formGroup.controls.photoContentType.value;

      const imageByte2 = formGroup.controls.photo2.value;
      const imageContentType2 = formGroup.controls.photo2ContentType.value;

      const imageByte3 = formGroup.controls.photo3.value;
      const imageContentType3 = formGroup.controls.photo3ContentType.value;

      if (!imageByte || !imageContentType) {
        return null;
      }

      const img = new Image();
      img.src = 'data:' + imageContentType + ';base64,' + imageByte;
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const img2 = new Image();
      img2.src = 'data:' + imageContentType2 + ';base64,' + imageByte2;
      const width2 = img2.naturalWidth;
      const height2 = img2.naturalHeight;

      const img3 = new Image();
      img3.src = 'data:' + imageContentType3 + ';base64,' + imageByte3;
      const width3 = img3.naturalWidth;
      const height3 = img3.naturalHeight;

      if (imageByte && !imageByte2 && !imageByte3) {
        return width <= w && height <= h ? null : { maxFileDimension: true };
      } else if (imageByte && imageByte2 && !imageByte3) {
        return width <= w && height <= h && width2 <= w && height2 <= h ? null : { maxFileDimension: true };
      } else if (imageByte && imageByte2 && imageByte3) {
        return width <= w && height <= h && width2 <= w && height2 <= h && width3 <= w && height3 <= h ? null : { maxFileDimension: true };
      }
    };
  }

  validateProductImageWidthHeightPartner(w: number, h: number): any {
    return (formGroup: UntypedFormGroup) => {
      const imageByte = formGroup.controls.logo.value;
      const imageContentType = formGroup.controls.logoContentType.value;

      if (!imageByte || !imageContentType) {
        return null;
      }

      const img = new Image();
      img.src = 'data:' + imageContentType + ';base64,' + imageByte;
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (imageByte) {
        return width <= w && height <= h ? null : { maxFileDimension: true };
      }
    };
  }
}
