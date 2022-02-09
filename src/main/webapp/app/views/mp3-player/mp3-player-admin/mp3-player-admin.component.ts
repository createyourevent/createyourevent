import { ICreateYourEventService } from './../../../entities/create-your-event-service/create-your-event-service.model';
import { Mp3Service } from './../../../entities/mp-3/service/mp-3.service';
import { GeneralService } from 'app/general.service';
import { IMp3 } from './../../../entities/mp-3/mp-3.model';
import { IEvent } from './../../../entities/event/event.model';
import { IProduct } from './../../../entities/product/product.model';
import { IShop } from './../../../entities/shop/shop.model';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';
import { IUser } from 'app/entities/user/user.model';
import { MessageService } from 'primeng/api';
import { Track } from 'ngx-audio-player';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'jhi-mp3-player-admin',
  templateUrl: './mp3-player-admin.component.html',
  styleUrls: ['./mp3-player-admin.component.scss'],
  providers: [MessageService],
})
export class Mp3PlayerAdminComponent implements OnInit, OnChanges {

  @Input() user: IUser
  @Input() service: ICreateYourEventService;
  @Input() shop: IShop;
  @Input() product: IProduct;
  @Input() jhiEvent: IEvent;
  @Input() url: string;

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

  uploadedFiles: any[] = [];

  mp3s: IMp3[] = [];

  constructor(private messageService: MessageService,
              private generalService: GeneralService,
              private translate: TranslateService,) { }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] !== undefined) {
      this.user = changes['user'].currentValue;
    }
    if (changes['service'] !== undefined) {
      this.service = changes['service'].currentValue;
    }
    if(this.user && this.service) {
      this.loadData();
    }
    if (changes['product'] !== undefined) {
      this.product = changes['product'].currentValue;
    }
    if(this.user && this.product) {
      this.loadData();
    }
    if (changes['shop'] !== undefined) {
      this.shop = changes['shop'].currentValue;
    }
    if(this.user && this.shop) {
      this.loadData();
    }
    if (changes['event'] !== undefined) {
      this.jhiEvent = changes['event'].currentValue;
    }
    if(this.user && this.jhiEvent) {
      this.loadData();
    }
  }

  ngOnInit(): void {
    if(this.user && this.service) {
      this.loadData();
    }
  }

  loadData(): void {
    if(this.service !== undefined) {
      this.generalService.findMp3ByServiceIdAndUserId(this.service.id, this.user.id).subscribe(m => {
        this.mp3s = m.body;
        this.loadMP3List();
      });
    }
    if(this.jhiEvent !== undefined) {
      this.generalService.findMp3ByEventIdAndUserId(this.jhiEvent.id, this.user.id).subscribe(m => {
        this.mp3s = m.body;
        this.loadMP3List();
      });
    }
    if(this.shop !== undefined) {
      this.generalService.findMp3ByShopIdAndUserId(this.shop.id, this.user.id).subscribe(m => {
        this.mp3s = m.body;
        this.loadMP3List();
      });
    }
    if(this.product !== undefined) {
      this.generalService.findMp3ByProductIdAndUserId(this.product.id, this.user.id).subscribe(m => {
        this.mp3s = m.body;
        this.loadMP3List();
      });
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

  onUpload(event: any): void {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
        this.uploadedFiles = this.uploadedFiles.slice();
    }
    this.loadData();
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
}

  deleteMp3(musicId: number, shop: IShop, product: IProduct, jhiEvent: IEvent,service: ICreateYourEventService): void {

    /*
    let suffix = '';

    if(service !== undefined) {
      suffix = '_service';
    }
    if(jhiEvent !== undefined) {
      suffix = '_event';
    }
    if(shop !== undefined) {
      suffix = '_shop';
    }
    if(product !== undefined) {
      suffix = '_product';
    }
    */
    this.generalService.deleteMP3(musicId).subscribe(() => {
      this.loadData();
    });
  }

onEnded(e: any): void {

}

}
