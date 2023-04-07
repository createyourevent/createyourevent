import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferComponent } from 'app/views/offer/offer.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { EditRowBoxComponent } from './editrow-box.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
  ],
  declarations: [OfferComponent, EditRowBoxComponent],
  exports: [OfferComponent],
})
export class OfferModule {}
