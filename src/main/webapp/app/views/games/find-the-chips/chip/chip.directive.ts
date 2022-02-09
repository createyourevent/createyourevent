import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[jhiChipHolder]'
})
export class ChipHolderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
