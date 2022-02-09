import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMp3 } from '../mp-3.model';

@Component({
  selector: 'jhi-mp-3-detail',
  templateUrl: './mp-3-detail.component.html',
})
export class Mp3DetailComponent implements OnInit {
  mp3: IMp3 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mp3 }) => {
      this.mp3 = mp3;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
