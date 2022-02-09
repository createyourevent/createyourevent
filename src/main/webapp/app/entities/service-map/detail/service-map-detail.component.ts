import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IServiceMap } from '../service-map.model';

@Component({
  selector: 'jhi-service-map-detail',
  templateUrl: './service-map-detail.component.html',
})
export class ServiceMapDetailComponent implements OnInit {
  serviceMap: IServiceMap | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceMap }) => {
      this.serviceMap = serviceMap;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
