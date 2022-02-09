import { HostBinding, Output } from '@angular/core';
import { Component, OnInit,  EventEmitter } from '@angular/core';
import { Chips, IChips } from 'app/entities/chips/chips.model';

@Component({
  selector: 'jhi-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent implements OnInit {

  @HostBinding('class') class = 'chip';

  id!: number;
  points!: number;
  website!: string;
  image!: string;
  imageContentType!: string;
  @Output() clickChip: EventEmitter<any> = new EventEmitter();

  @HostBinding('style.left.px')
  left = 0;

  @HostBinding('style.top.px')
  top = 0;

  @HostBinding('style.color')
  color = '#ffffff';

  constructor() { }

  ngOnInit(): void {}

  click(): void {
    const chip: IChips = new Chips();
    chip.id = this.id;
    chip.points = this.points;
    chip.website = this.website;
    chip.image = this.image;
    chip.imageContentType = this.imageContentType;
    chip.x = this.left;
    chip.y = this.top;
    chip.color = this.color;
    this.clickChip.emit({chip: chip});
  }
}
