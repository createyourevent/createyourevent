import { Injectable } from '@angular/core';
import { CloudData } from 'angular-tag-cloud-module';
import { GeneralService } from 'app/general.service';
import * as dayjs from "dayjs";

@Injectable({
  providedIn: 'root'
})
export class TickerService {
  private tags: CloudData[];

  constructor(private generalService: GeneralService) {}

  public getTags(): CloudData[] {
    return this.tags;
  }

  load(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.generalService.findAllTags().subscribe(response => {
        const md = response.body;
        const nd: CloudData[] = [];
        md.forEach(tag => {
           if (tag.shop !== null && tag.shop.active === true && tag.shop.activeOwner === true) {
            nd.push({
              text: tag.tag,
              weight: this.getRandomInt(5, 9),
              color: this.getRandomColor(),
              rotate: this.getRandomInt(-30, 30),
              link: '/supplier/shop/' + tag.shop.id + '/overview'
            });
          } else if (tag.event !== null && tag.event.active === true && tag.event.dateStart > dayjs()) {
            nd.push({
              text: tag.tag,
              weight: this.getRandomInt(5, 9),
              color: this.getRandomColor(),
              rotate: this.getRandomInt(-30, 30),
              link: '/events/' + tag.event.id + '/view'
            });
          } else if (tag.service !== null && tag.service.active === true && tag.service.activeOwner === true) {
            nd.push({
              text: tag.tag,
              weight: this.getRandomInt(5, 9),
              color: this.getRandomColor(),
              rotate: this.getRandomInt(-30, 30),
              link: '/services/' + tag.service.id + '/viewService'
            });
          }
        });
        nd.sort(() => Math.random() - 0.5);
        this.tags = nd.slice(0, 20);

        resolve(true);
      });
    });
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
