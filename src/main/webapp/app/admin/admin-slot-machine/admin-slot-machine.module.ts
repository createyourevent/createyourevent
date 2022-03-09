import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSlotMachineComponent } from './admin-slot-machine.component';
import { AdminSlotMachineRoutes } from './admin-slot-machine.routing';
import { SharedModule } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { PickListModule } from 'primeng/picklist';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminSlotMachineRoutes,
    InputNumberModule,
    FormsModule,
    PickListModule,
    HttpClientModule,
    FileUploadModule,
  ],
  declarations: [AdminSlotMachineComponent],
})
export class AdminSlotMachineModule {}
