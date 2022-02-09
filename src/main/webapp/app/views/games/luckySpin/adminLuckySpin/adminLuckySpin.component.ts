import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { PropertyService } from 'app/entities/property/service/property.service';
import { GeneralService } from 'app/general.service';


@Component({
  selector: 'jhi-admin-lucky-spin',
  templateUrl: './adminLuckySpin.component.html',
  styleUrls: ['./adminLuckySpin.component.scss']
})

export class AdminLuckySpinComponent implements OnInit {

  minimumPoints_wheeloffortune = 0;
  maximumPoints_wheeloffortune = 0;
  commitmentPoints_wheeloffortune = 0;
  segments_wheeloffortune = 0;


  form = new FormGroup({});
  model = {minimumPoints_wheeloffortune: 0, maximumPoints_wheeloffortune: 0, commitmentPoints_wheeloffortune: 0, segments_wheeloffortune: 0 };
  fields: FormlyFieldConfig[] = [
    {
      key: 'minimumPoints_wheeloffortune',
      type: 'input',
      templateOptions: {
        label: 'Minimum points',
        placeholder: 'Minimum points which could be win.',
        required: true,
      }
    },
    {
      key: 'maximumPoints_wheeloffortune',
      type: 'input',
      templateOptions: {
        label: 'Maximum points',
        placeholder: 'Maximum points which could be win.',
        required: true,
      }
    },
    {
      key: 'commitmentPoints_wheeloffortune',
      type: 'input',
      templateOptions: {
        label: 'The commitment for one game.',
        placeholder: 'The commitment from the user to play.',
        required: true,
      }
    },
    {
      key: 'segments_wheeloffortune',
      type: 'input',
      templateOptions: {
        label: 'Segments',
        placeholder: 'How many segments should be on the wheel.',
        required: true,
      }
    },

  ];

  constructor(private generalService: GeneralService, private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.generalService.findPropertyByKey('minimumPoints_wheeloffortune').subscribe(rt => {
      this.minimumPoints_wheeloffortune = Number(rt.body!.value);
      this.generalService.findPropertyByKey('maximumPoints_wheeloffortune').subscribe(rw => {
        this.maximumPoints_wheeloffortune = Number(rw.body!.value);
        this.generalService.findPropertyByKey('commitmentPoints_wheeloffortune').subscribe(rq => {
          this.commitmentPoints_wheeloffortune = Number(rq.body!.value);
          this.generalService.findPropertyByKey('segments_wheeloffortune').subscribe(re => {
            this.segments_wheeloffortune = Number(re.body!.value);
            this.model = {minimumPoints_wheeloffortune: this.minimumPoints_wheeloffortune, maximumPoints_wheeloffortune: this.maximumPoints_wheeloffortune, commitmentPoints_wheeloffortune: this.commitmentPoints_wheeloffortune, segments_wheeloffortune: this.segments_wheeloffortune };
          });
        });
      });
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.generalService.findPropertyByKey('minimumPoints_wheeloffortune').subscribe(rt => {
        const mp = rt.body!;
        mp.value = this.model.minimumPoints_wheeloffortune.toString();
        this.propertyService.update(mp).subscribe();
      });
      this.generalService.findPropertyByKey('maximumPoints_wheeloffortune').subscribe(rt => {
        const mp = rt.body!;
        mp.value = this.model.maximumPoints_wheeloffortune.toString();
        this.propertyService.update(mp).subscribe();
      });
      this.generalService.findPropertyByKey('commitmentPoints_wheeloffortune').subscribe(rt => {
        const mp = rt.body!;
        mp.value = this.model.commitmentPoints_wheeloffortune.toString();
        this.propertyService.update(mp).subscribe();
      });
      this.generalService.findPropertyByKey('segments_wheeloffortune').subscribe(rt => {
        const mp = rt.body!;
        mp.value = this.model.segments_wheeloffortune.toString();
        this.propertyService.update(mp).subscribe();
      });
    }
  }

}
