import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { PropertyService } from 'app/entities/property/service/property.service';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-admin-tetris',
  templateUrl: './admin-tetris.component.html',
  styleUrls: ['./admin-tetris.component.scss']
})
export class AdminTetrisComponent implements OnInit {

  commitment = 0;
  linePoints = 0;

  form = new FormGroup({});
  model = { commitment_tetris: 0, linePoints_tetris: 0 };
  fields: FormlyFieldConfig[] = [
    {
      key: 'commitment_tetris',
      type: 'input',
      templateOptions: {
        label: 'Commitment points',
        placeholder: 'Commitment for this game-round.',
        required: true,
      }
    },
    {
      key: 'linePoints_tetris',
      type: 'input',
      templateOptions: {
        label: 'Line points',
        placeholder: 'Points for a deleted line.',
        required: true,
      }
    },
  ];


  constructor(private generalService: GeneralService, private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.generalService.findPropertyByKey('commitment_tetris').subscribe(cp => {
      const property = cp.body;
      this.commitment = Number(property!.value);
    });
    this.generalService.findPropertyByKey('linePoints_tetris').subscribe(cp => {
      const property = cp.body;
      this.linePoints = Number(property!.value);
    });
  }

  onSubmit(): void {
    this.generalService.findPropertyByKey('commitment_tetris').subscribe(cp => {
      const property = cp.body!;
      property.value = this.model.commitment_tetris.toString();
      this.propertyService.update(property).subscribe();
    });
    this.generalService.findPropertyByKey('linePoints_tetris').subscribe(cp => {
      const property = cp.body!;
      property.value = this.model.linePoints_tetris.toString();
      this.propertyService.update(property).subscribe();
    });
  }

}
