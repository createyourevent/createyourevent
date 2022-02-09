import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class SwitchOffOnEmitterService {

  invokeSwitchOffOn = new EventEmitter();
  subsVar!: Subscription;

  constructor() { }

  onSwitchOffOnButtonClick(value: string): void {
    this.invokeSwitchOffOn.emit(value);
  }
}
