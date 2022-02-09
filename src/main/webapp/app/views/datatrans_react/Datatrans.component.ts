import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  SimpleChanges
} from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Datatrans, { IDatatransFormProps } from './DatatransComponent';

const containerElementName = 'myReactComponentContainer';

@Component({
  selector: 'datatrans-component',
  template: `<div [id]="rootId"><span #${containerElementName}></span></div>`,
  encapsulation: ViewEncapsulation.None,
})
export class ReactFeelingFormComponent implements OnChanges, AfterViewInit {

  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;

  @Input() transactionId: string;
  @Input() production: boolean;


  @Output() public onLoaded = new EventEmitter<void>();
  @Output() public onOpened = new EventEmitter<void>();
  @Output() public onCancelled = new EventEmitter<void>();
  @Output() public onError = new EventEmitter<string>();

  public rootId = 'datatrans-form-root';
  private hasViewLoaded = false;

  payButton!: string;

  constructor(private translate: TranslateService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactionId'] !== undefined && changes['transactionId'].currentValue !== undefined) {
      this.transactionId = changes['transactionId'].currentValue;
      this.renderComponent();
      this.translate.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
        this.payButton = this.translate.instant("datatrans.pay");
      });
    }
  }

  public ngAfterViewInit() {
    this.hasViewLoaded = true;
    this.renderComponent();
  }

  private renderComponent() {
    if (!this.hasViewLoaded) {
      return;
    }

    const props: IDatatransFormProps = {
      production: this.production,
      transactionId: this.transactionId,
      onLoaded: () => this.onLoaded.emit(),
      onOpened: () => this.onOpened.emit(),
      onCancelled: () => this.onCancelled.emit(),
      onError: (data) => this.onError.emit(data)
    };

    ReactDOM.render(
      React.createElement(Datatrans, props),
      document.getElementById(this.rootId)
    );
  }
}
