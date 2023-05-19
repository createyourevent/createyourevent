import { Injectable } from '@angular/core';
import { CloudData } from 'angular-tag-cloud-module';
import { GeneralService } from 'app/general.service';
import * as dayjs from 'dayjs';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TickerService {
  constructor(private generalService: GeneralService) {}

  load(): Observable<CloudData[]> {
    return this.generalService.findAllTags().pipe(
      map(response => {
        const md = response.body!;
        const tags = md
          .filter(tag => {
            if (tag.shop) {
              return tag.shop.active === true && tag.shop.activeOwner === true;
            } else if (tag.event) {
              return tag.event.active === true && tag.event.dateStart! > dayjs();
            } else if (tag.service) {
              return tag.service.active === true && tag.service.activeOwner === true;
            }
            return false;
          })
          .map(tag => ({
            text: tag.tag!,
            weight: this.getRandomInt(5, 9),
            color: this.getRandomColor(),
            rotate: this.getRandomInt(-30, 30),
            link:
              tag.shop !== null
                ? '/supplier/shop/' + tag.shop.id + '/overview'
                : tag.event !== null
                ? '/events/' + tag.event.id + '/view'
                : '/services/' + tag.service!.id + '/viewService',
          }));
        return tags.sort(() => Math.random() - 0.5).slice(0, 50);
      })
    );
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomColor(): string {
    const c = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    return c;
  }
}
