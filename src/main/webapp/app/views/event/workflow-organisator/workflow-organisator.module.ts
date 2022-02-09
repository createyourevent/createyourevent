import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkflowOrganisatorComponent } from './workflow-organisator.component';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  imports: [SharedModule, InputSwitchModule],
  declarations: [WorkflowOrganisatorComponent],
  exports: [WorkflowOrganisatorComponent]
})
export class WorkflowOrganisatorModule {}
