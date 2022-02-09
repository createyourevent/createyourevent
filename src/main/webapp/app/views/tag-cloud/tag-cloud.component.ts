import { Component, OnInit, OnDestroy } from "@angular/core";
import { CloudOptions, CloudData } from "angular-tag-cloud-module";
import { TagsService } from "app/entities/tags/service/tags.service";
import { ITags } from "app/entities/tags/tags.model";
import { TagCloudService } from "./tag-cloud.service";


@Component({
  selector: 'jhi-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['tag-cloud.component.scss']
})
export class TagCloudComponent implements OnInit, OnDestroy {
  tags!: ITags[];

  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 0.98,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 500,
    overflow: false
  };

  data: CloudData[] = [];

  constructor(private tagsService: TagsService, private provider: TagCloudService) {}

  ngOnInit(): void {
    this.newData();
  }

  ngOnDestroy(): void {}

  newData(): void {
    this.data = this.provider.getTags();
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomColor(): string {
    const c = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    return c;
  }
}
