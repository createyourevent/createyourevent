import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AllParticipantsComponent } from './all-participants.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AllParticipantsComponent],
  exports: [AllParticipantsComponent]
})
export class AllParticipantsModule {}
