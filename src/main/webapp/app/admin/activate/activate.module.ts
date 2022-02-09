import { MatTabsModule } from '@angular/material/tabs';
import { ActivateComponent } from './activate.component';
import { RouterModule } from '@angular/router';
import { ACTIVATE_ROUTE } from './activate.route';
import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([ACTIVATE_ROUTE]),
    MatTabsModule,
    MatSlideToggleModule,
    InputSwitchModule,
    CheckboxModule
  ],
  declarations: [ActivateComponent]
})
export class ActivateModule {}
