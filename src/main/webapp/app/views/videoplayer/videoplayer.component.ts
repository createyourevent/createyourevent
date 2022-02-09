import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements OnInit {

  video: string;

  constructor() { }

  ngOnInit() {
    this.video = "https://createyourevent.org/content/video/createyourevent.mp4"
  }

}
