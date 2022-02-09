import { IShop } from './../../entities/shop/shop.model';
import { IEvent } from './../../entities/event/event.model';
import { IProduct } from './../../entities/product/product.model';
import { GeneralService } from './../../general.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ICreateYourEventService } from 'app/entities/create-your-event-service/create-your-event-service.model';
import { IMp3 } from 'app/entities/mp-3/mp-3.model';
import { IUser } from 'app/entities/user/user.model';
import { Track } from 'ngx-audio-player';

@Component({
  selector: 'jhi-mp3-player',
  templateUrl: './mp3-player.component.html',
  styleUrls: ['./mp3-player.component.scss']
})
export class Mp3PlayerComponent implements OnInit, OnChanges {

  @Input() user: IUser
  @Input() mp3s: IMp3[] = [];
  @Input() product: IProduct[];
  @Input() service: ICreateYourEventService[];
  @Input() event: IEvent[];
  @Input() shop: IShop[];

  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2,4,6];
  msaapDisplayVolumeControls = true;
  msaapDisplayRepeatControls = true;
  msaapDisplayArtist = false;
  msaapDisplayDuration = false;
  msaapDisablePositionSlider = true;
  pageSizeOptions = 10;
  msaapPlaylist: Track[] = [];

  constructor(private generalService: GeneralService

    ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mp3s'] !== undefined) {
      this.mp3s = changes['mp3s'].currentValue;
      this.loadMP3List();
    }
  }

  loadMP3List(): void {
    this.msaapPlaylist = [];
    this.mp3s.forEach(ele => {
      this.msaapPlaylist.push(
        {
          title: ele.title,
          link: ele.url,
          artist: ele.artists,
          duration: ele.duration
        }
      );
    });
    this.msaapPlaylist = this.msaapPlaylist.slice();
  }

  onEnded(e: any): void {

  }

}
