import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomNumber'
})
export class RandomNumberPipe implements PipeTransform {
  transform(max: number, args?: any): any {
    let min = 1;
    let x = Math.floor(Math.random() * (max - min + 1)) + min;
    return x;
  }
}
