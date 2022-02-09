import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-please-wait-dialog',
  templateUrl: './please-wait-dialog.component.html',
  styleUrls: ['./please-wait-dialog.component.scss']
})
export class PleaseWaitDialogComponent implements OnInit {

  @Input() display = false;
  constructor() { }

  ngOnInit() {
  }

}
