import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserExtension } from '../user-extension.model';

@Component({
  selector: 'jhi-user-extension-detail',
  templateUrl: './user-extension-detail.component.html',
})
export class UserExtensionDetailComponent implements OnInit {
  userExtension: IUserExtension | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userExtension }) => {
      this.userExtension = userExtension;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
