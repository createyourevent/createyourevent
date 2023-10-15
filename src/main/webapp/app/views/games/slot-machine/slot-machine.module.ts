import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotMachineComponent } from './slot-machine.component';
import { SharedModule } from 'app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

@NgModule({
  imports: [CommonModule, SharedModule, ButtonModule, ToastModule, CardModule],
  declarations: [SlotMachineComponent],
  exports: [SlotMachineComponent],
})
export class SlotMachineModule {}
