import { Component, Input, OnInit, OnDestroy, ElementRef, Output,  EventEmitter  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'jhi-countdown-timer',
  template: `<div class="countdown"><div class="countdown_text" jhiTranslate="countdown.text">This event starts in:</div><div class="display">{{ displayTime }}</div></div>`,
  styleUrls: ['countdown.component.scss']
})
export class CountdownTimerComponent implements OnInit, OnDestroy{

  @Input() start: any;
  @Input() end: any;
  @Output() zeroTrigger;
  @Input() timeOnly: any;
  @Input() photo = false;
  timer: any;
  displayTime: any;
  constructor(
    private el: ElementRef, private translate: TranslateService,
  ) {
    this.zeroTrigger = new EventEmitter(true);

  }

  ngOnInit(): void {
    if(this.photo){
      if (this.start) {
        this.displayTime = this.getTimeDiff(this.start, true);
    } else {
        this.displayTime = this.getTimeDiff(this.end);
    }
    }else {
      this.timer = setInterval(() => {

        if (this.start) {
            this.displayTime = this.getTimeDiff(this.start, true);
        } else {
            this.displayTime = this.getTimeDiff(this.end);
        }
      }, 1000);
    }
  }


  ngOnDestroy(): void {
    if(!this.photo) {
      this.stopTimer();
    }
  }

  private getTimeDiff( datetime: any, useAsTimer = false ): string {

      datetime = new Date( datetime ).getTime();
      const now = new Date().getTime();

      if( isNaN(datetime) )
      {
          return "";
      }

      let milisecDiff = datetime - now;
      if (useAsTimer) {
          milisecDiff = now - datetime;
      }

      // Zero Time Trigger
      if (milisecDiff <= 0) {
        this.zeroTrigger.emit("reached zero");
        return "00 " + this.translate.instant('countdown.days') + " : 00 " + this.translate.instant('countdown.hours') + " : 00 "  +  this.translate.instant('countdown.minutes') + " : 00 " + this.translate.instant('countdown.seconds');
      }

      const days = Math.floor(milisecDiff / 1000 / 60 / (60 * 24));
      const dateDiff = new Date( milisecDiff );
      const dayString = (days) ? this.twoDigit(days) + " " + this.translate.instant('countdown.days') + " : " : "";
      const dayHours = days * 24;


      if (this.timeOnly) {
        const hours = dateDiff.getUTCHours() + dayHours;
        return  this.twoDigit(hours) +
        " " + this.translate.instant('countdown.hours') + " : " + this.twoDigit(dateDiff.getUTCMinutes()) + " " + this.translate.instant('countdown.minutes') + " : "
        + this.twoDigit(dateDiff.getUTCSeconds()) + " " + this.translate.instant('countdown.seconds');
      } else {
        // Date() takes a UTC timestamp – getHours() gets hours in local time not in UTC. therefore we have to use getUTCHours()
        return dayString + this.twoDigit(dateDiff.getUTCHours()) + " " + this.translate.instant('countdown.hours') +
           " : " + this.twoDigit(dateDiff.getUTCMinutes()) + " " + this.translate.instant('countdown.minutes') + " : "
           + this.twoDigit(dateDiff.getUTCSeconds()) + " " + this.translate.instant('countdown.seconds');

      }
  }


  private twoDigit(number: number): string {
      return number > 9 ? "" + number: "0" + number;
  }

  private stopTimer(): void {
    clearInterval(this.timer);
    this.timer = undefined;
  }

}
