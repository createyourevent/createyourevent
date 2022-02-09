import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortener'
})
export class ShortenerPipe implements PipeTransform {
  transform(description: string): string {
    const result = description.substr(0,30);
    const finalResult = result + "...";

    return finalResult;
  }
}
