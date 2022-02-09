import { Input, Component, OnChanges, SimpleChanges } from '@angular/core';
import { IImage } from 'app/entities/image/image.model';

@Component({
  selector: 'jhi-gallery-product',
  templateUrl: './gallery-product.component.html',
  styleUrls: ['gallery-product.component.scss']
})
export class GalleryProductComponent implements OnChanges {
  @Input() images!: IImage[];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '960px',
      numVisible: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'] !== undefined) {
      this.images = changes['images'].currentValue;
    }
  }
}
