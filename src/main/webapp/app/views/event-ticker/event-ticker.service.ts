import { Injectable } from '@angular/core';
import { CloudData } from 'angular-tag-cloud-module';
import { EventService } from 'app/entities/event/service/event.service';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';
@Injectable({
  providedIn: 'root'
})
export class EventTickerService {
  private tags!: CloudData[];

  constructor(private generalService: GeneralService, private eventService: EventService) {}

  public getTags(): CloudData[] {
    return this.tags;
  }

  load(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.generalService.find50EventTagsRandomly().subscribe(response => {
        const md = response.body;
        const nd: CloudData[] = [];
        let i = 0;
        md!.forEach(tag => {
          this.eventService.find(tag.event.id).subscribe(e => {
            i++;
            if(dayjs().isBefore(dayjs(e.body.dateEnd))) {
              nd.push({
                text: tag.tag!,
                weight: this.getRandomInt(5, 9),
                color: this.getRandomColor(),
                rotate: this.getRandomInt(-30, 30),
                link: '/events/' + tag.event!.id + '/view'
              });
            }
            if(i === md.length) {
              nd.sort(() => Math.random() - 0.5);
              this.tags = nd.slice(0, nd.length);
              resolve(true);
            }
          });
        });
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
