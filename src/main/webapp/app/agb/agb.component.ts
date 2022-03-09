import { IUser } from './../entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-agb',
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss'],
})
export class AgbComponent implements OnInit {
  pdfSrc = 'https://createyourevent.org/content/pdf/AGB.pdf';
  user: IUser;

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
    });
  }

  switchAGB(): void {
    this.generalService.updateAGBTrue(this.user.id).subscribe();
  }
}
