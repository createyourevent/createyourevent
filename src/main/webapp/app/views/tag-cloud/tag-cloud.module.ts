import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TagCloudComponent } from './tag-cloud.component';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { TagCloudService } from './tag-cloud.service';

@NgModule({
  imports: [SharedModule, TagCloudModule],
  declarations: [TagCloudComponent],
  exports: [TagCloudComponent],
})
export class CYETagCloudModule {}
