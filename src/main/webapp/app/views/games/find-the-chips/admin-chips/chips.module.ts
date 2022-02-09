import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ChipsComponent } from './chips.component';
import { ChipsDetailComponent } from './chips-detail.component';
import { ChipsUpdateComponent } from './chips-update.component';
import { ChipsDeleteDialogComponent } from './chips-delete-dialog.component';
import { chipsRoute } from './chips.route';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ColorPickerModule } from 'primeng/colorpicker';

@NgModule({
  imports: [SharedModule, CommonModule, RouterModule.forChild(chipsRoute), SelectButtonModule, TableModule, ColorPickerModule],
  declarations: [ChipsComponent, ChipsDetailComponent, ChipsUpdateComponent, ChipsDeleteDialogComponent],
  entryComponents: [ChipsDeleteDialogComponent],
  exports: [RouterModule]
})
export class CreateyoureventCYEChipsModule {}
