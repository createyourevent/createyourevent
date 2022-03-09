import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotMachineComponent } from './slot-machine.component';
import { SharedModule } from 'app/shared/shared.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [CommonModule, SharedModule, ButtonModule],
  declarations: [SlotMachineComponent],
  exports: [SlotMachineComponent],
})
export class SlotMachineModule {}
